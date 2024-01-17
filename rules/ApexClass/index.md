# ApexClass
### An Apex class name must be PascalCase
regex: `^[A-Z][A-Za-z0-9]*$`  
Field: `Name`
#### Example
CustomerAssessmentController  
### Config to use
```json
{
  "sObject": "ApexClass",
  "field": "Name",
  "when": "NamespacePrefix = null",
  "regex": "^[A-Z][A-Za-z0-9]*$",
  "message": "An Apex class name must be PascalCase",
  "goodExample": "CustomerAssessmentController"
}
```

### An ApexClass must have a Description
Field: `Body`
#### Example

```js
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
```
  
### Config to use
```json
{
  "sObject": "ApexClass",
  "field": "Body",
  "computedField": "description",
  "when": "NamespacePrefix = null",
  "nameField": "Name",
  "message": "An ApexClass must have a Description",
  "goodExample": "\n```js\n/** \n * BoatDataService exposes utilities to manipulate data related to boat\n * @author \"John Doe\"\n * @date 25/04/2023\n**/\npublic with sharing class BoatDataService {\n\n    public static final String LENGTH_TYPE = 'Length'; \n    public static final String PRICE_TYPE = 'Price'; \n    public static final String TYPE_TYPE = 'Type'; \n\n    @AuraEnabled(cacheable=true)\n    public static List<Boat__c> getBoats(String boatTypeId) {\n        // Without an explicit boatTypeId, the full list is desired\n        String query = 'SELECT '\n                     + 'Name, Description__c, Geolocation__Latitude__s, '\n                     + 'Geolocation__Longitude__s, Picture__c, Contact__r.Name, '\n                     + 'BoatType__c, BoatType__r.Name, Length__c, Price__c '\n                     + 'FROM Boat__c';\n        if (String.isNotBlank(boatTypeId)) {\n            query += ' WHERE BoatType__c = :boatTypeId';\n        }\n        query += ' WITH SECURITY_ENFORCED ';\n        return Database.query(query);\n    }\n}\n```\n"
}
```

### An ApexClass must have an author
Field: `Body`
#### Example

```js
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
```
  
### Config to use
```json
{
  "sObject": "ApexClass",
  "field": "Body",
  "computedField": "author",
  "when": "NamespacePrefix = null",
  "nameField": "Name",
  "message": "An ApexClass must have an author",
  "goodExample": "\n```js\n/** \n * BoatDataService exposes utilities to manipulate data related to boat\n * @author \"John Doe\"\n * @date 25/04/2023\n**/\npublic with sharing class BoatDataService {\n\n    public static final String LENGTH_TYPE = 'Length'; \n    public static final String PRICE_TYPE = 'Price'; \n    public static final String TYPE_TYPE = 'Type'; \n\n    @AuraEnabled(cacheable=true)\n    public static List<Boat__c> getBoats(String boatTypeId) {\n        // Without an explicit boatTypeId, the full list is desired\n        String query = 'SELECT '\n                     + 'Name, Description__c, Geolocation__Latitude__s, '\n                     + 'Geolocation__Longitude__s, Picture__c, Contact__r.Name, '\n                     + 'BoatType__c, BoatType__r.Name, Length__c, Price__c '\n                     + 'FROM Boat__c';\n        if (String.isNotBlank(boatTypeId)) {\n            query += ' WHERE BoatType__c = :boatTypeId';\n        }\n        query += ' WITH SECURITY_ENFORCED ';\n        return Database.query(query);\n    }\n}\n```\n"
}
```

### Apex variables must be camelCase
regex: `^[a-z][A-Za-z0-9]*$`  
Field: `SymbolTable`

### Config to use
```json
{
  "sObject": "ApexClass",
  "field": "SymbolTable",
  "computedField": "SymbolTable.variables",
  "regex": "^[a-z][A-Za-z0-9]*$",
  "tooling": true,
  "when": "NamespacePrefix = null",
  "nameField": "Name",
  "message": "Apex variables must be camelCase"
}
```

### Apex methods must be camelCase
regex: `^[a-z][A-Za-z0-9]*$`  
Field: `SymbolTable`

### Config to use
```json
{
  "sObject": "ApexClass",
  "field": "SymbolTable",
  "computedField": "SymbolTable.methods",
  "regex": "^[a-z][A-Za-z0-9]*$",
  "tooling": true,
  "when": "NamespacePrefix = null",
  "nameField": "Name",
  "message": "Apex methods must be camelCase"
}
```
