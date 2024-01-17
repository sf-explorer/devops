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

const ApexExample = `
\`\`\`js
/** 
 * BoatDataService exposes utilities to manipulate data related to boat
 * @author "John Doe"
 * @date 25/04/2023
**/
public with sharing class BoatDataService {

    public static final String LENGTH_TYPE = 'Length'; 
    public static final String PRICE_TYPE = 'Price'; 
    public static final String TYPE_TYPE = 'Type'; 

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId) {
        // Without an explicit boatTypeId, the full list is desired
        String query = 'SELECT '
                     + 'Name, Description__c, Geolocation__Latitude__s, '
                     + 'Geolocation__Longitude__s, Picture__c, Contact__r.Name, '
                     + 'BoatType__c, BoatType__r.Name, Length__c, Price__c '
                     + 'FROM Boat__c';
        if (String.isNotBlank(boatTypeId)) {
            query += ' WHERE BoatType__c = :boatTypeId';
        }
        query += ' WITH SECURITY_ENFORCED ';
        return Database.query(query);
    }
}
\`\`\`
`
const rules = [
    {
        sObject: "EntityDefinition",
        field: "Description",
        nameField: "QualifiedApiName",
        message: "A custom object Description is required",
        tooling: true,
        when: "QualifiedApiName like '%__c' and IsCustomizable = true",
    },
    {
        sObject: "EntityDefinition",
        field: "qualifiedApiName",
        when: "QualifiedApiName like '%__c' and IsCustomizable = true",
        regex: "^[A-Z][A-Za-z]*$",
        message: "A custom object Name must be PascalCase",
        goodExample: "InsurancePolicy",
        badExample: 'Insurance_Policy',
    },
    {
        sObject: "EntityDefinition",
        field: "qualifiedApiName",
        when: "QualifiedApiName like '%__c' and IsCustomizable = true",
        relatedFields: ["(select QualifiedApiName from Fields where QualifiedApiName like '%__c')"],
        computedField: "Fields.totalSize",
        lessThan: 100,
        message: "Less than 100 custom fields"
    },
    {
        sObject: "EntityDefinition",
        field: "qualifiedApiName",
        when: "QualifiedApiName like '%__c' and IsCustomizable = true",
        relatedFields: ["(select Name from ApexTriggers where NamespacePrefix = null limit 10 )"],
        computedField: "ApexTriggers.totalSize",
        tooling: true,
        lessThan: 2,
        message: "Maximum one custom trigger"
    },
    {
        sObject: "CustomField",
        field: "DeveloperName",
        regex: "^[A-Z][A-Za-z0-9]*$",
        message: "A CustomField API Name must be PascalCase",
        tooling: true,
        goodExample: "PhoneNumber",
        badExample: 'Phone_Number',
    },
    {
        sObject: "CustomField",
        nameField: "DeveloperName",
        field: "Description",
        tooling: true,
        message: "Custom Fields must have a Description.",
        additionalMessage: "If you lack imagination, use SF Explorer ChatGPT native integration to generate it!"
    },
    {
        sObject: "Flow",
        field: "Description",
        tooling: true,
        message: "Flow Description is required"
    },
    {
        sObject: "Flow",
        field: "MasterLabel",
        tooling: true,
        message: `Flow Label must be Short Yet Meaningful`,
        additionalMessage:`
**Autolaunched Flow:**
- Users or Apps: <Verb(s)><Optional Noun Set>
- Flow Trigger: <Object Name> Before Handler
- Scheduled: <Short Process Description>`,
        badExample: `Send reminder – Not enough information; principal words not capitalized`,
        goodExample: `Screen Flow:
-Reschedule Order Delivery

Autolaunched Flow:
- Users or Apps: Add Default Opportunity Team Members
- Flow Trigger: Case Before Handler
- Scheduled: Remind Opportunity Owners`
    },
    {
        sObject: "PermissionSet",
        field: "Description",
        nameField: "Name",
        when: "IsOwnedByProfile = false and NamespacePrefix = null",
        message: "Description is required",
    },
    {
        sObject: "PermissionSet",
        field: "Name",
        when: "IsOwnedByProfile = false and NamespacePrefix = null",
        message: "Name is required",
        goodExample: PSetExample,
    },
    {
        sObject: "ApexClass",
        field: "Name",
        when: "NamespacePrefix = null",
        regex: "^[A-Z][A-Za-z0-9]*$",
        message: "An Apex class name must be PascalCase",
        goodExample: 'CustomerAssessmentController',
    },
    {
        sObject: "ApexClass",
        field: "Body",
        computedField: "description",
        when: "NamespacePrefix = null",
        nameField: "Name",
        message: "An ApexClass must have a Description",
        goodExample: ApexExample,
    },
    {
        sObject: "ApexClass",
        field: "Body",
        computedField: "author",
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
        computedField: "author",
        when: "ManageableState = 'unmanaged' and FilePath like '%js'",
        nameField: "FilePath",
        tooling: true,
        message: "An LWC must have an author",
    },
    {
        sObject: "LightningComponentResource",
        field: "Source",
        computedField: "description",
        when: "ManageableState = 'unmanaged' and FilePath like '%js'",
        nameField: "FilePath",
        tooling: true,
        message: "An LWC must have a description",
    },
    {
        sObject: "OmniUiCard",
        field: "Description",
        nameField: "Name",
        message: "Flexcards must have a description",
    },
    {
        sObject: "OmniProcess",
        field: "Name",
        relatedFields: ["(select id from OmniProcessElements)"],
        computedField: "OmniProcessElements.totalSize",
        lessThan: 100,
        message: "OmniProcess must have less than 100 elements",
    },
]

module.exports = rules