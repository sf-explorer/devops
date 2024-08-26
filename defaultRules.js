const omnistudio = require("./rules/omnistudio.json")
const permissions = require("./rules/permissions.json")

const JSDocExample = `
Here is an example
\`\`\`js
import { LightningElement, api } from 'lwc';

/**
 * Liste des contrats
 * @author "Nicolas Despres"
 * @see "Onglet Equipement" https://jira.atlassian.net/browse/XCC-71
 * @param contract string 
 */
export default class socle360EquipementDetailContrat extends LightningElement {
    @api
    contract
}
\`\`\`
`

const ApexGoodExample = `
* ActivityTimelineController
* ActivityTimelineControllerTest
* RetrieveInteractionsMapper
* RetrieveInteractionsMock
`

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
const rules = [
    {
        sObject: "EntityDefinition",
        field: "QualifiedApiName",
        computedField: "QualifiedApiName",
        when: "PublisherId = '<local>'",
        regex: "^[A-Z][A-Za-z0-9]*(__c|__mdt|__ka|__kav)$",
        message: "A custom object Name must be in english and PascalCase",
        goodExample: "InsurancePolicy",
        badExample: 'Insurance_Policy',
    },
    {
        sObject: "EntityDefinition",
        field: "Description",
        regex: "^.{10,}$",
        nameField: "QualifiedApiName",
        message: "A custom object Description is required",
        goodExample: "More than 10 chars",
        tooling: true,
        when: "PublisherId = '<local>'",
    },
    {
        sObject: "EntityDefinition",
        field: "QualifiedApiName",
        nameField: "QualifiedApiName",
        relatedFields: ["(select QualifiedApiName from Fields where QualifiedApiName like '%__c')"],
        computedField: "Fields.totalSize",
        lessThan: 100,
        message: "Less than 100 custom fields"
    },
    {
        sObject: "EntityDefinition",
        field: "QualifiedApiName",
        nameField: "QualifiedApiName",
        relatedFields: ["(select Name from ApexTriggers where NamespacePrefix = null limit 10 )"],
        computedField: "ApexTriggers.totalSize",
        when: "PublisherId = '<local>'",
        tooling: true,
        lessThan: 2,
        message: "Maximum one custom trigger per object"
    },
    {
        sObject: "EntityDefinition",
        field: "QualifiedApiName",
        relatedFields: ["(select Name from RecordTypes where NamespacePrefix = null limit 10 )"],
        computedField: "RecordTypes.totalSize",
        when: "PublisherId = '<local>'",
        tooling: true,
        lessThan: 16,
        message: "Maximum 15 record types per object"
    },
    {
        sObject: "CustomField",
        field: "DeveloperName",
        regex: "^[A-Z][A-Za-z0-9]*$",
        when: "ManageableState = 'unmanaged'",
        message: "A CustomField API Name must be in english and PascalCase",
        tooling: true,
        goodExample: "PhoneNumber",
        badExample: 'Phone_Number',
    },
    {
        sObject: "CustomField",
        nameField: "DeveloperName",
        when: "ManageableState = 'unmanaged'",
        field: "Description",
        regex: "^.{10,}$",
        tooling: true,
        message: "Custom Fields must have a Description (at least 10 chars)"
    },
    {
        sObject: "Flow",
        field: "Description",
        nameField: "MasterLabel",
        when: "Status = 'Active'",
        regex: "^.{10,}$",
        tooling: true,
        message: "Flow Description is required (at least 10 chars)"
    },
    {
        sObject: "Flow",
        field: "MasterLabel",
        tooling: true,
        message: `Flow Label must be Short Yet Meaningful`,
        additionalMessage: `
**Autolaunched Flow:**
- Users or Apps: <Verb(s)><Optional Noun Set>
- Flow Trigger: <Object Name> Before Handler
- Scheduled: <Short Process Description>`,
        badExample: `Send reminder – Not enough information; principal words not capitalized`,
        goodExample: `Screen Flow:  
- Reschedule Order Delivery

Autolaunched Flow:  
- Users or Apps: Add Default Opportunity Team Members
- Flow Trigger: Case Before Handler
- Scheduled: Remind Opportunity Owners`
    },
    {
        sObject: "ApexClass",
        field: "Name",
        when: "NamespacePrefix = null",
        regex: "^([A-Z][A-Za-z0-9_]*(Controller|CallIn|CallOut|Test|Helper|Mapping|Mock|TriggerHandler|Wrapper|Batchable|Queuable|Schedulable|EntityManager|ServiceManager|DataManager))|(TestDataFactory|Constant)$",
        message: "An Apex class name must be PascalCase and use a correct Suffix",
        goodExample: ApexGoodExample,
    },
    {
        sObject: "ApexClass",
        field: "Body",
        computedField: "Body",
        when: "NamespacePrefix = null",
        nameField: "Name",
        message: "An ApexClass must follow the best practices",
        pmd: '',
        goodExample: `* No DML in loop
* Optimize SOQL with related lists
* **No Hardcoded values**  
`,
    },
    {
        sObject: "ApexClass",
        field: "Body",
        computedField: "Body.description",
        when: "NamespacePrefix = null",
        nameField: "Name",
        message: "An ApexClass must have a Description",
        goodExample: ApexExample,
    },
    {
        sObject: "ApexClass",
        field: "Body",
        computedField: "Body.author",
        when: "NamespacePrefix = null",
        nameField: "Name",
        message: "An ApexClass must have an author",
        goodExample: ApexExample,
    },
    {
        sObject: "ApexClass",
        field: "SymbolTable",
        computedField: "SymbolTable.variables",
        regex: "^[a-z][A-Za-z0-9]*$",
        tooling: true,
        when: "NamespacePrefix = null",
        nameField: "Name",
        message: "Apex variables must be camelCase",
    },
    {
        sObject: "ApexClass",
        field: "SymbolTable",
        computedField: "SymbolTable.methods",
        regex: "^[a-z][A-Za-z0-9]*$",
        tooling: true,
        when: "NamespacePrefix = null",
        nameField: "Name",
        message: "Apex methods must be camelCase",
    },
    {
        sObject: "LightningComponentResource",
        field: "Source",
        computedField: "Source.author",
        when: "ManageableState = 'unmanaged' and FilePath like '%js'",
        nameField: "FilePath",
        goodExample: JSDocExample,
        tooling: true,
        message: "An LWC must have an author",
    },
    {
        sObject: "LightningComponentResource",
        field: "Source",
        computedField: "Source.description",
        when: "ManageableState = 'unmanaged' and FilePath like '%js'",
        nameField: "FilePath",
        goodExample: JSDocExample,
        tooling: true,
        message: "An LWC must have a description",
    },
    ...permissions,
    ...omnistudio,
    {
        "sObject": "ExternalString",
        "field": "Name",
        "tooling": true,
        "when": "NamespacePrefix='' and (NOT Name LIKE 'omni_%')",
        "regex": "^[A-Z][A-Za-z0-9_]*$",
        "message": "CustomLabel name must be PascalCase"
    },
   /* {
        "sObject": "FlexiPage",
        "nameField": "DeveloperName",
        "field": "Description",
        "tooling": true,
        "regex": "^.{10,}$",
        "message": "LightningRecordPage must have a description"
    },*/
    {
        "sObject": "StaticResource",
        "nameField": "Name",
        "field": "Description",
        "when": "NamespacePrefix=''",
        "regex": "^.{10,}$",
        "message": "StaticResource must have a description"
    },
    {
        "sObject": "CustomApplication",
        "nameField": "DeveloperName",
        "field": "Description",
        "tooling": true,
        "regex": "^.{10,}$",
        "message": "CustomApplication must have a description"
    },
    {
        "sObject": "ValidationRule",
        "nameField": "ValidationName",
        "field": "Description",
        "tooling": true,
        "when": "NamespacePrefix='' and Active=true",
        "regex": "^.{10,}$",
        "message": "ValidationRule must have a description"
    },
    {
        "sObject": "WebLink",
        "nameField": "Name",
        "field": "Description",
        "tooling": true,
        "when": "NamespacePrefix=''",
        "regex": "^.{10,}$",
        "message": "Custom Button must have a description"
    },
    {
        "sObject": "WebLink",
        "field": "Name",
        "tooling": true,
        "when": "NamespacePrefix=''",
        regex: "^[A-Z][A-Za-z0-9]*$",
        "message": "Custom Button name must be pascal case"
    },
]

module.exports = rules