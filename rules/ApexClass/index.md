# ApexClass
### An Apex class name must be PascalCase
regex: `^[A-Z][A-Za-z0-9]*$`  
Field: `Name`
#### Example
CustomerAssessmentController  

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
  

### Apex variables must be camelCase
regex: `^[a-z][A-Za-z0-9]*$`  
Field: `SymbolTable`


### Apex methods must be camelCase
regex: `^[a-z][A-Za-z0-9]*$`  
Field: `SymbolTable`

