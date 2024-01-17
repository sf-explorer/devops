const rules = require('./defaultRules')

function soqlFromRule(rule, date) {
    const fromDate = date ? date : '2024-01-01'
    const fromDateCriteria = "where  LastModifiedDate > " + fromDate + "T00:00:00Z"
    const criteria = rule.when ? ` and ${rule.when}` : ''
    const query = `Select ${rule.field}${rule.relatedFields ?
        (', ' + rule.relatedFields.join(', ')) : ''}${rule.nameField ? `, ${rule.nameField}` : ''}
    from ${rule.sObject}
       ${fromDateCriteria} ${criteria} 
       order by LastModifiedDate desc limit 200`

    return query
}

module.exports = {
    rules,
    soqlFromRule,
}