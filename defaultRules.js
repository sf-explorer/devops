const omnistudio = require("./rules/omnistudio.json")
const PSetExample = `### For Object/Field pern sets,
Start with the Object Name, and with the CRUD access provided, and anything special goes in the middle. Like this:

* Account - (R/C/E)
* Case - (R)
* Case - Delete Access - No Fields - (R/C/E/D)
* Contact - General Access - (R/E)
* Contact - Sensitive Fields Only - (R)

### For System Permissions
Start each Perm Set with SYS so that their grouped together:
* SYS - Reports
* SYS - Dashboards
* SYS - View Setup

### For App access
Start with APP:
* APP - Sales App
* APP - Service App

### For Tabs:
* TAB - Accounts Tab
* TAB - Tasks Tab

### For Apex Class access:
* APEX - Account LWC Controller
* APEX - Case Invocable Actions`

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
* ActivityTimeline_Controller
* ActivityTimeline_Controller_Test
* RetrieveInteractions_ServiceOut
* RetrieveInteractions_ServiceOut_Mock
* RetrieveInteractions_ServiceOut_Test
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
        regex: "^.{20,}$",
        nameField: "QualifiedApiName",
        message: "A custom object Description is required",
        goodExample: "More than 20 chars",
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
        regex: "^.{20,}$",
        tooling: true,
        message: "Custom Fields must have a Description (at least 20 chars)"
    },
    {
        sObject: "Flow",
        field: "Description",
        nameField: "MasterLabel",
        regex: "^.{20,}$",
        tooling: true,
        message: "Flow Description is required (at least 20 chars)"
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
        sObject: "PermissionSet",
        field: "Name",
        when: "IsOwnedByProfile = false and NamespacePrefix = null",
        message: "Name is following project convention",
        goodExample: PSetExample,
    },
    {
        sObject: "PermissionSet",
        field: "Description",
        nameField: "Name",
        regex: "^.{20,}$",
        when: "IsOwnedByProfile = false and NamespacePrefix = null",
        message: "Description is required (more than 20 chars)",
    },
    {
        sObject: "ApexClass",
        field: "Name",
        when: "NamespacePrefix = null",
        regex: "^[A-Z][A-Za-z0-9_]*(Controller|CallIn|CallOut|Test|Helper|Mapping|Mock|TriggerHandler|TestDataFactory|Wrapper|Constant|Batchable|Queuable|Schedulable|EntityManager|ServiceManager|DataManager)$",
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
    {
        sObject: "FieldPermissions",
        nameField: "SobjectType",
        field: "Field",
        message: "No field level security on Profiles (except System Administrator)",
        goodExample: "Use a permission set instead",
        where: "ParentId IN ( SELECT Id FROM PermissionSet WHERE IsOwnedByProfile = true) and Parent.Profile.Name != 'System Administrator'"
    },
    ...omnistudio

]

module.exports = rules