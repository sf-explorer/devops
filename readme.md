# SF Explorer Devops Rules

A set of [declarative rules](./defaultRules.js) allowing to perform simple checks on your orgs with SF Explorer Engine

## Pipeline integration
Create a file named `.env` with the following content:
```
USERNAME=XXX
PASSWORD=XXX
LOGINURL=https://login.salesforce.com
DATE=2023-12-01
```

Run the command:  
```cmd
npx @sf-explorer/devops.cli
```
The command will generate an output file name `testReport.xml` similar to the one you can find [here](./cli/test-report.xml).


## Rules Examples
### EntityDefinition
[A custom object Description is required](./rules/EntityDefinition/index.md)  
[A custom object Name must be PascalCase](./rules/EntityDefinition/index.md)  
[Less than 100 custom fields](./rules/EntityDefinition/index.md)  
[Maximum one custom trigger](./rules/EntityDefinition/index.md)  

### CustomField
[A CustomField API Name must be PascalCase](./rules/CustomField/index.md)  
[Custom Fields must have a Description](./rules/CustomField/index.md)  

### Flow
[Flow Description is required](./rules/Flow/index.md)  
[Flow Label must be Short Yet Meaningful](./rules/Flow/index.md)  

### PermissionSet
[Description is required](./rules/PermissionSet/index.md)  
[Name is required](./rules/PermissionSet/index.md)  

### ApexClass
[An Apex class name must be PascalCase](./rules/ApexClass/index.md)  
[An ApexClass must have a Description](./rules/ApexClass/index.md)  
[An ApexClass must have an author](./rules/ApexClass/index.md)  
[Apex variables must be camelCase](./rules/ApexClass/index.md)  
[Apex methods must be camelCase](./rules/ApexClass/index.md)  

### LightningComponentResource
[An LWC must have an author](./rules/LightningComponentResource/index.md)  
[An LWC must have a description](./rules/LightningComponentResource/index.md)  

### OmniUiCard
[Flexcards must have a description](./rules/OmniUiCard/index.md)  

### OmniProcess
[OmniProcess must have less than 100 elements](./rules/OmniProcess/index.md)  
