# OmniProcess
### OmniProcess must have less than 100 elements
Field: `Name`

### Config to use
```json
{
  "sObject": "OmniProcess",
  "field": "Name",
  "relatedFields": [
    "(select id from OmniProcessElements)"
  ],
  "computedField": "OmniProcessElements.totalSize",
  "lessThan": 100,
  "message": "OmniProcess must have less than 100 elements"
}
```
