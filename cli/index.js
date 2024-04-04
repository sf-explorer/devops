#!/usr/bin/env node

// 3rd party dependencies
const path = require('path'),
    jsforce = require('jsforce')
const { exit } = require('process')
var builder = require('junit-report-builder')
const { command } = require('@polycuber/script.cli')

const { rules, soqlFromRule, checkBestPractices, passRule } = require("@sf-explorer/devops")

require('dotenv').config();
const LOGIN_URL = process.env.LOGINURL || 'https://test.salesforce.com'


const version = '59.0'

var conn = new jsforce.Connection({ loginUrl: LOGIN_URL, version })


const rulesByObject = rules.reduce((prev, cur) => {
    if (!prev[cur.sObject]) {
        prev[cur.sObject] = builder.testSuite().name('Check rules for ' + cur.sObject);
    }
    return prev
}, {})

function getRecordName(record, rule) {
    if (rule.nameField) {
        return record[rule.nameField]
    }
    return record[rule.field]

}


async function query(soql, tooling) {
    if (process.env.PASSWORD) {
        const parent = rule.tooling ? conn.tooling : conn
        return parent.query(soql)
    }

    const context = command.read.exec('sfdx force:data:soql:query -q "' + soql + '" --json' + (tooling ? ' -t' : ''), {})
    const data = JSON.parse(context)
    if (data.status === 0) {
        return data.result
    }
    console.error(data)
    throw 'Invalid Query'
}

async function computeRule(rule, suite) {
    const date = process.env.DATE === 'TODAY' ? new Date().toISOString().slice(0, 10) : process.env.DATE
    const soql = soqlFromRule(rule, date)

    try {
        const res = await query(soql.replaceAll('\n', ' ').replaceAll("'", "\'"), rule.tooling)
        const errors = res.records.map(record => {
            var testCase = suite.testCase()
                .className(rule.sObject + '.' + getRecordName(record, rule))
                .name(rule.message)
            const recordErrors = passRule(record, rule) ? [] : [{}]
            if (recordErrors.length > 0) {
                testCase.failure('Changed done by ' + (record.LastModifiedBy?.Name || ''))
            }
            return { errors: recordErrors }

        }).filter(res => res.errors.length > 0)

        console.log(`${rule.sObject}.${rule.field}[${rule.message}] ${errors.length}/${res.records.length}`)
        return errors.length
    } catch (e) {
        console.error(e, soql)
        return 0
    }
}

async function main() {
    if (process.env.PASSWORD) {
        await conn.login(process.env.SFEXP_LOGIN || process.env.USERNAME, process.env.SFEXP_PASSWORD || process.env.PASSWORD)
    } else {
        try {
            const context = command.read.call('sfdx', ['force:org:display', '--json'],)
            const data = JSON.parse(context)
            conn = new jsforce.Connection({
                instanceUrl: data.result.instanceUrl,
                accessToken: data.result.accessToken,
            })
        } catch (e) {
            console.error(e)
            exit(1)
        }
    }
    const filters = (process.env.RULES || '').split(',')

    const promises = rules
        .filter(rule => (filters.length === 1 && filters[0] === '') || filters.includes(rule.sObject))
        .map((rule) => {
            return computeRule(rule, rulesByObject[rule.sObject])
        })

    const res = await Promise.all(promises)
    const result = res.reduce((prev, cur) => {
        return prev + cur
    }, 0)
    builder.writeTo('test-report.xml')
    if (result > 0) {
        console.error('Found', result, 'errors, see test-report.xml for details.')
    }
    exit(result > 0 ? 1 : 0)
}

main()