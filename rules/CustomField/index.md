# CustomField
### A CustomField API Name must be PascalCase
regex: `^[A-Z][A-Za-z0-9]*$`  
Field: `DeveloperName`
#### Example
PhoneNumber  
### Config to use
```json
{
  "sObject": "CustomField",
  "field": "DeveloperName",
  "regex": "^[A-Z][A-Za-z0-9]*$",
  "message": "A CustomField API Name must be PascalCase",
  "tooling": true,
  "goodExample": "PhoneNumber",
  "badExample": "Phone_Number"
}
```

### Custom Fields must have a Description.
Field: `Description`

### Config to use
```json
{
  "sObject": "CustomField",
  "nameField": "DeveloperName",
  "field": "Description",
  "tooling": true,
  "message": "Custom Fields must have a Description.",
  "additionalMessage": "If you lack imagination, use SF Explorer ChatGPT native integration to generate it!"
}
```
