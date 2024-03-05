# EntityDefinition
## A custom object Description is required
Field: `Description`   
Regex: `^.{20,}$`    
#### Example
More than 20 chars  


## A custom object Name must be PascalCase
Field: `QualifiedApiName.api`   
Regex: `^[A-Z][A-Za-z0-9]*$`    
#### Example
InsurancePolicy  


## Less than 100 custom fields
Field: `Fields.totalSize`   



## Maximum one custom trigger
Field: `ApexTriggers.totalSize`   



## Maximum 3 record types
Field: `RecordTypes.totalSize`   


