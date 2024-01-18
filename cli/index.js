#!/usr/bin/env node

// 3rd party dependencies
const path = require('path'),
    jsforce = require('jsforce')

var builder = require('junit-report-builder');

const { rules, soqlFromRule, checkBestPractices } = require("@sf-explorer/devops")

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
        prev[cur.sObject] = []
    }
    prev[cur.sObject].push(cur)
    return prev
}, {})

function getRecordName(record, rule) {
    if (rule.nameField) {
        return record[rule.nameField]
    }
    return record[rule.field]

}

async function computeRule(rule, suite) {
    const soql = soqlFromRule(rule, process.env.DATE)

    const parent = rule.tooling ? conn.tooling : conn
    try {

        const res = await parent.query(soql)
        const errors = res.records.map(record => {
            var testCase = suite.testCase()
                .className(rule.sObject + '.' + getRecordName(record, rule))
                .name(rule.message)
            const recordErrors = checkBestPractices(record)
            if (recordErrors.length > 0) {
                testCase.failure(record.LastModifiedBy?.Name || '')
            }
            return { errors: recordErrors }

        }).filter(res => res.errors.length > 0)

        console.log(`${rule.sObject}.${rule.field}[${rule.message}] ${errors.length}/${res.records.length}`)
    } catch (e) {
        console.error(e)
    }
}

var fs = require('fs');
async function main() {
    const userinfo = await conn.login(process.env.USERNAME, process.env.PASSWORD)
    const promises = []
    Object.keys(rulesByObject).forEach(async (objectName) => {
        var suite = builder.testSuite().name('Check rules for ' + objectName);
        const rules = rulesByObject[objectName]

        rules
            //.filter(rule => !rule.sObject.startsWith('Omni'))
            .forEach(async (rule) => {
                promises.push(computeRule(rule, suite))
            })
    })
    await Promise.all(promises)
    builder.writeTo('test-report.xml');
}





main()