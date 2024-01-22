const getValue = require('./getValue')

const ApexExample = `
\`\`\`js
/** 
 * BoatDataService exposes utilities to manipulate data related to boat
 * @author "John Doe"
 * @date 25/04/2023
**/
public with sharing class BoatDataService {
    public static final String LENGTH_TYPE = 'Length'; 

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId) {
    }
}
\`\`\`
`

const record = {
    Body: ApexExample
}

const rule1 = {
    field: 'Body',
    computedField: 'Body.description'
}

const rule2 = {
    field: 'Body',
    computedField: 'Body.date'
}

const d = getValue(record, rule2)

console.log(d)