const rules = require('./defaultRules')

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


function getRules(sobject) {
   
    return rules.filter(rule => rule.sObject === sobject.attributes?.type)
        .filter(rule => sobject[rule.field] !== undefined)
}

function hasBestPractices(sobject) {
    const rules = getRules(sobject).filter(rule => sobject[rule.field] !== undefined)
    return rules.length > 0
}

var dotGet = function (str, obj) {

    return str.split('.').reduce(function (cur, i) {
        if (!cur) return undefined
        return cur[i];
    }, obj)
}

function checkBestPractices(sobject) {
    const rules = getRules(sobject)
    const res= []
    rules.forEach(rule => {
        let data
        if (rule.computedField) {
            data = dotGet(rule.computedField, sobject) || ''
        } else {
            data = sobject[rule.field] || ''
        }

        if (rule.regex) {
            //console.log(data)
            const pattern = new RegExp(rule.regex)
            if (Array.isArray(data)) {
                data.forEach(el => {
                    if (!pattern.test(el.name)) {
                        res.push({ name: rule.message + ' ' + el.name })
                    }
                })
            } else {
                if (!pattern.test(data)) {
                    res.push({ name: rule.message })
                }
            }

        } else if (rule.lessThan) {
            if (data > rule.lessThan) {
                res.push({ name: rule.message })
            }
        } else {
            if (data === '') {
                res.push({ name: rule.message })
            }
        }
    })
    return res
}

module.exports = {
    rules,
    soqlFromRule,
    checkBestPractices,
}