const rules = require('./defaultRules')
const getValue = require('./lib/getValue')

function soqlFromRule(rule, date) {
    const fromDate = date ? date : '2024-01-01'
    const fromDateCriteria = "where  LastModifiedDate > " + fromDate + "T00:00:00Z"
    const criteria = rule.when ? ` and ${rule.when}` : ''
    const query = `Select ${rule.field}${rule.relatedFields ?
        (', ' + rule.relatedFields.join(', ')) : ''}${rule.nameField ? `, ${rule.nameField}` : ''}, LastModifiedBy.Name
    from ${rule.sObject}
       ${fromDateCriteria} ${criteria} 
       order by LastModifiedDate desc limit 200`

    return query
}

function ruleDetail(rule) {
    const regex = rule.regex ? `Regex: \`${rule.regex}\`    
`: ''
    const goodExample = rule.goodExample ? `#### Example
${rule.goodExample}  ` : ''
    return `## ${rule.message}
Field: \`${rule.computedField || rule.field}\`   
${regex}${goodExample}

`

/**
 * ### Configuration to use
\`\`\`json
${JSON.stringify(rule, null, 2)}
\`\`\`

### SOQL Generated
\`\`\`sql
${soqlFromRule(rule, '2024-01-01')}
\`\`\`
 */
}


function getRules(sobject) {
    return rules.filter(rule => rule.sObject === sobject.attributes?.type)
        .filter(rule => sobject[rule.field] !== undefined)
}

function hasBestPractices(sobject) {
    const rules = getRules(sobject)
    return rules.length > 0
}

function passRule(sobject, rule) {
    const data = getValue(sobject, rule)
    if (rule.regex) {
        const pattern = new RegExp(rule.regex)
        if (Array.isArray(data)) {
            const subErrors = data.filter(el => !pattern.test(el?.name || ''))
            if (subErrors.length > 0) {
                return false
            }
        } else {
            return false
        }
    } else if (rule.lessThan ) {
        if (typeof data === 'number') {
            return data < rule.lessThan
        }
        return data === undefined || data === ''
    } else if (!data) {
        return false
    }
    return true
}

function checkBestPractices(sobject) {
    const rules = getRules(sobject)
    const res = []
    rules.forEach(rule => {
        if (!passRule(sobject, rule)) {
            res.push({ name: rule.message })
        }
    })
    return res
}

module.exports = {
    rules,
    passRule,
    hasBestPractices,
    soqlFromRule,
    checkBestPractices,
    ruleDetail,
    getValue,
}