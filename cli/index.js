#!/usr/bin/env node

// 3rd party dependencies
const jsforce = require('jsforce')
const { exit } = require('process')
var builder = require('junit-report-builder')
const { command, file } = require('@polycuber/script.cli')
const { rules,
    soqlFromRule,
    passRule,
    getValue
} = require("@sf-explorer/devops")

require('dotenv').config();
const LOGIN_URL = process.env.LOGINURL || 'https://test.salesforce.com'


const version = '60.0'

var conn = new jsforce.Connection({ loginUrl: LOGIN_URL, version })
var ignoreList = []
var ignoreAuthorList = []
let runtime = 'sf'

const rulesByObject = rules.reduce((prev, cur) => {
    if (!prev[cur.sObject]) {
        prev[cur.sObject] = builder.testSuite().name('Check rules for ' + cur.sObject);
    }
    return prev
}, {})

function getFullName(record, rule) {
    const cValue = getValue(record, rule)
    let value = ''
    if (typeof cValue === 'string') {
        value = cValue?.slice(0, 30)
    }
    if (rule.nameField) {
        let res = record[rule.nameField]
        if (value !== '') {
            res = res + '.' + value
        }
        return res
    }
    return value
}


async function query(soql, tooling) {
    if (process.env.PASSWORD || process.env.SFEXP_PASSWORD) {
        const parent = tooling ? conn.tooling : conn
        return parent.query(soql)
    }

    const context = command.read.exec(runtime + ' force:data:soql:query -q "' + soql + '" --json' + (tooling ? ' -t' : ''), {})
    const data = JSON.parse(context)
    if (data.status === 0) {
        return data.result
    }
    console.error(data)
    throw 'Invalid Query'
}

function ignoreRecord(record, rule) {
    const ignoreBasedOnAuthor = ignoreAuthorList.includes('@' + record.LastModifiedBy?.Name)
    return ignoreBasedOnAuthor || ignoreList.some(exclusionRule => {
        const pattern = new RegExp(exclusionRule)
        return pattern.test(rule.sObject + '.' + getFullName(record, rule))
    })
}

async function computeRule(rule, suite) {
    const date = process.env.DATE === 'TODAY' ? new Date().toISOString().slice(0, 10) : process.env.DATE
    const soql = soqlFromRule(rule, date)

    try {
        console.log('Checking rule: ' + rule.message)
        const res = await query(soql.replaceAll('\n', ' ').replaceAll("'", "\'"), rule.tooling)
        const errors = res.records.map(record => {
            const ignore = ignoreRecord(record, rule)
            if (ignore) return

            var testCase = suite.testCase()
                .className(rule.sObject + '.' + getFullName(record, rule))
                .name(rule.message)

            const recordError = passRule(record, rule) ? undefined : {
                scope: rule.sObject,
                target: getFullName(record, rule),
                violation: rule.message,
                author: record.LastModifiedBy?.Name || '',
                date: record.LastModifiedDate?.slice(0, 10).replaceAll('\n', ' ') || ''
            }
            if (recordError) {
                testCase.failure('Changed done by ' + (record.LastModifiedBy?.Name || ''))

            }
            return recordError

        }).filter(res => res !== undefined)

        //console.log(`${rule.sObject}.${rule.field}[${rule.message}] ${errors.length}/${res.records.length}`)
        return errors
    } catch (e) {
        console.error(e, soql)
        return []
    }
}


async function main() {
    if (process.env.PASSWORD || process.env.SFEXP_PASSWORD) {
        runtime = 'jsforce'
        await conn.login(process.env.SFEXP_LOGIN || process.env.USERNAME, process.env.SFEXP_PASSWORD || process.env.PASSWORD)
    } else {
        try {
            const context = command.read.call('sf', ['force:org:display', '--json'],)
            const data = JSON.parse(context)
            conn = new jsforce.Connection({
                instanceUrl: data.result.instanceUrl,
                accessToken: data.result.accessToken,
            })
            console.log('Connected to ' + data.result.alias + ' using sf')
            runtime = 'sf'
        } catch (e) {
            try {
                const context = command.read.call('sfdx', ['force:org:display', '--json'],)
                const data = JSON.parse(context)
                conn = new jsforce.Connection({
                    instanceUrl: data.result.instanceUrl,
                    accessToken: data.result.accessToken,
                })
                console.log('Connected to ' + data.result.alias + ' using sfdx')
                runtime = 'sfdx'
            } catch (e) {
                console.error('You need either sf, sfdx or to provide SFEXP_LOGIN/SFEXP_PASSWORD env variables to connect')
                exit(1)
            }
        }
    }
    const filters = (process.env.RULES || '').split(',')

    const promises = rules
        .filter(rule => (filters.length === 1 && filters[0] === '') || filters.includes(rule.sObject))
        .map((rule) => {
            return computeRule(rule, rulesByObject[rule.sObject])
        })

    const computedRules = await Promise.all(promises)

    const allErrors = [].concat.apply([], computedRules)

    const nbErrors = allErrors.length
    var csv_string = allErrors.map(error => Object.values(error).join(',')).join('\n')
    file.write.json('errors.json', allErrors)
    file.write.text('errors.csv', csv_string)

    builder.writeTo('test-report.xml')
    if (nbErrors > 0) {
        console.table(allErrors)
        console.error('Found', nbErrors, 'errors, see test-report.xml for details.')
        console.info("You may ignore errors with a file named '.sfexplorerignore'")
    } else {
        console.log('No error found')
    }
    exit(nbErrors > 0 ? 1 : 0)
}

if (file.exists('./.sfexplorerignore')) {
    const ignore = file.read.text('./.sfexplorerignore')
    ignoreList = ignore.split('\n')
        .filter(rule => rule.indexOf('#') !== 0)
        .filter(rule => rule.indexOf('@') !== 0)
        .filter(rule => rule.replaceAll(' ', '') !== '')

    ignoreAuthorList = ignore.split('\n')
        .filter(rule => rule.indexOf('@') === 0)
}

main()