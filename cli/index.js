#!/usr/bin/env node

// 3rd party dependencies
const path = require('path'),
    jsforce = require('jsforce')
const { exit } = require('process')
var builder = require('junit-report-builder')

const { rules, soqlFromRule, checkBestPractices, passRule } = require("@sf-explorer/devops")

require('dotenv').config();
const LOGIN_URL = process.env.LOGINURL || 'https://test.salesforce.com'

if (!(process.env.USERNAME)) {
    console.error('Cannot start app: missing mandatory configuration. Check your .env file.');
    process.exit(-1);
}

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


async function computeRule(rule, suite) {
    const date = process.env.DATE === 'TODAY' ? new Date().toISOString().slice(0, 10) : process.env.DATE
    const soql = soqlFromRule(rule, date)

    const parent = rule.tooling ? conn.tooling : conn
    try {

        const res = await parent.query(soql)
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
        console.error(e)
        return 0
    }
}

async function main() {
    await conn.login(process.env.USERNAME, process.env.PASSWORD)
    const filters = (process.env.RULES || '').split(',')
   
    const promises = rules
            .filter(rule => (filters.length === 1 && filters[0]==='') || filters.includes(rule.sObject))
            .map( (rule) => {
               return computeRule(rule, rulesByObject[rule.sObject])
            })

    const res = await Promise.all(promises)
    const result = res.reduce((prev, cur) => {
        return prev + cur
    }, 0)
    builder.writeTo('test-report.xml')
    exit(result > 0 ? 1 : 0)
}

main()