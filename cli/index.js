#!/usr/bin/env node

// 3rd party dependencies
const jsforce = require('jsforce')
const { exit } = require('process')
var builder = require('junit-report-builder')
const { command, file } = require('@polycuber/script.cli')

const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 [options]')
    .alias('d', 'from-date')
    .describe('d', 'From date execution, in format YYYY-MM-DD')
    .default('d', '2024-04-01')
    .alias('e', 'exclude-author')
    .describe('e', 'Exclude specified author, in format @name, multiple values are supported')
    .alias('o', 'target-org')
    .describe('o', 'Username or alias of the target org. Not required if the `target-org` configuration variable is already set.')
    .alias('u', ' sfdx-url')
    .describe('u', 'sfdx auth url')
    .alias('r', 'print-rules')
    .describe('r', 'Print rules')
    .help('h')
    .alias('h', 'help')
    .parse();

const { rules,
    soqlFromRule,
    passRule,
    getValue
} = require("@sf-explorer/devops")

let orgAlias = argv.o ? ` -o ${argv.o}` : ''

require('dotenv').config();
const LOGIN_URL = process.env.LOGINURL || 'https://test.salesforce.com'


const version = '60.0'

var conn = new jsforce.Connection({ loginUrl: LOGIN_URL, version })
var ignoreList = []
var ignoreAuthorList = []
var authUrls = []
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

    const context = command.read.exec(runtime + ' force:data:soql:query -q "' + soql + '" --json' + (tooling ? ' -t' : '') + orgAlias, {})
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

async function computeRule(rule, suite, orgName) {
    const fromDate = process.env.DATE || argv.d
    const date = fromDate === 'TODAY' ? new Date().toISOString().slice(0, 10) : fromDate
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
                date: (record.LastModifiedDate || record.SystemModstamp)?.slice(0, 10).replaceAll('\n', ' ') || ''
            }
            if (recordError) {
                testCase.failure((record.LastModifiedBy?.Name ? `Changed done by ${record.LastModifiedBy?.Name}` : '') + (orgName ? ` on ${orgName}` : ''))

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


async function scanOrg(url) {
    if (process.env.PASSWORD || process.env.SFEXP_PASSWORD) {
        runtime = 'jsforce'
        await conn.login(process.env.SFEXP_LOGIN || process.env.USERNAME, process.env.SFEXP_PASSWORD || process.env.PASSWORD)
    } else {
        try {
            if (url) {
                file.write.text('./sfdxAuthUrl.txt', url)
                command.read.exec('sf org login sfdx-url --sfdx-url-file sfdxAuthUrl.txt -a org')
                orgAlias = ' -o org'
                console.log('***  Connected using sf on' + url.split("@").pop() + ' ***')
            } else {
                command.read.exec(`sf force:org:display --json ${orgAlias}`,)
                console.log('Connected using sf')
            }


            runtime = 'sf'
        } catch (e) {

            try {
                command.read.exec(`sfdx force:org:display --json  ${orgAlias}`,)
                console.log('Connected using sfdx')
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
            return computeRule(rule, rulesByObject[rule.sObject], url?.split("@").pop())
        })
    const computedRules = await Promise.all(promises)

    return [].concat.apply([], computedRules)

}


async function main() {
    let allErrors = []

    if (file.exists('.sfdxAuthUrls')) {
        authUrls = file.read.text('.sfdxAuthUrls')?.split('\n')
    }

    if (authUrls.length > 0) {
        for (const org of authUrls) {
            const res = await scanOrg(org)
            allErrors = [...allErrors, ...res.map(item => ({ ...item, org: org.split('@').pop() }))]
        }
    } else {
        allErrors = await scanOrg()
    }

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

if (argv.e) {
    if (typeof argv.e === 'string') {
        ignoreAuthorList.push(argv.e)
    } else if (Array.isArray(argv.e)) {
        ignoreAuthorList = [...ignoreAuthorList, ...argv.e]
    }
}



if (argv.u) {
    if (typeof argv.u === 'string') {
        authUrls.push(argv.u)
    } else if (Array.isArray(argv.u)) {
        authUrls = [...authUrls, ...argv.u]
    }
}

if (argv.r) {
    console.log(rules)
} else {
    main()
}





