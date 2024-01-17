# EntityDefinition
### A custom object Description is required
Field: `Description`

### Config to use
```json
{
  "sObject": "EntityDefinition",
  "field": "Description",
  "nameField": "QualifiedApiName",
  "message": "A custom object Description is required",
  "tooling": true,
  "when": "QualifiedApiName like '%__c' and IsCustomizable = true"
}
```

### A custom object Name must be PascalCase
regex: `^[A-Z][A-Za-z]*$`  
Field: `qualifiedApiName`
#### Example
InsurancePolicy  
### Config to use
```json
{
  "sObject": "EntityDefinition",
  "field": "qualifiedApiName",
  "when": "QualifiedApiName like '%__c' and IsCustomizable = true",
  "regex": "^[A-Z][A-Za-z]*$",
  "message": "A custom object Name must be PascalCase",
  "goodExample": "InsurancePolicy",
  "badExample": "Insurance_Policy"
}
```

### Less than 100 custom fields
Field: `qualifiedApiName`

### Config to use
```json
{
  "sObject": "EntityDefinition",
  "field": "qualifiedApiName",
  "when": "QualifiedApiName like '%__c' and IsCustomizable = true",
  "relatedFields": [
    "(select QualifiedApiName from Fields where QualifiedApiName like '%__c')"
  ],
  "computedField": "Fields.totalSize",
  "lessThan": 100,
  "message": "Less than 100 custom fields"
}
```

### Maximum one custom trigger
Field: `qualifiedApiName`

### Config to use
```json
{
  "sObject": "EntityDefinition",
  "field": "qualifiedApiName",
  "when": "QualifiedApiName like '%__c' and IsCustomizable = true",
  "relatedFields": [
    "(select Name from ApexTriggers where NamespacePrefix = null limit 10 )"
  ],
  "computedField": "ApexTriggers.totalSize",
  "tooling": true,
  "lessThan": 2,
  "message": "Maximum one custom trigger"
}
```
