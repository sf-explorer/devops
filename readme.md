# SF Explorer Devops Rules

A set of [declarative rules](./defaultRules.js) allowing to perform simple checks on your orgs with SF Explorer Engine

## Pipeline integration
Create a file named `.env` with the following content:
```bash
USERNAME=XXX
PASSWORD=XXX # Password+SecurityToken
LOGINURL=https://login.salesforce.com #or https://test.salesforce.com
DATE=TODAY  #or 2024-01-01
RULES=EntityDefinition,CustomField  #specify to only run rules on EntityDefinition and CustomField - remove param to check all rules
```

Run the command:  
```cmd
npx @sf-explorer/devops.cli
```
The command will generate an output file name `testReport.xml` similar to the one you can find [here](./cli/test-report.xml).


If you don't provide a username, it will try to connect using `SFDX`

## Rules Examples
### EntityDefinition
[A custom object Description is required](./Sample%20Rules/EntityDefinition/index.md)  
[A custom object Name must be PascalCase](./Sample%20Rules/EntityDefinition/index.md)  
[Less than 100 custom fields](./Sample%20Rules/EntityDefinition/index.md)  
[Maximum one custom trigger](./Sample%20Rules/EntityDefinition/index.md)  

### CustomField
[A CustomField API Name must be PascalCase](./Sample%20Rules/CustomField/index.md)  
[Custom Fields must have a Description.](./Sample%20Rules/CustomField/index.md)  

### Flow
[Flow Description is required](./Sample%20Rules/Flow/index.md)  
[Flow Label must be Short Yet Meaningful](./Sample%20Rules/Flow/index.md)  

### PermissionSet
[Description is required](./Sample%20Rules/PermissionSet/index.md)  
[Name is required](./Sample%20Rules/PermissionSet/index.md)  

### ApexClass
[An Apex class name must be PascalCase](./Sample%20Rules/ApexClass/index.md)  
[An ApexClass must have a Description](./Sample%20Rules/ApexClass/index.md)  
[An ApexClass must have an author](./Sample%20Rules/ApexClass/index.md)  
[Apex variables must be camelCase](./Sample%20Rules/ApexClass/index.md)  
[Apex methods must be camelCase](./Sample%20Rules/ApexClass/index.md)  

### LightningComponentResource
[An LWC must have an author](./Sample%20Rules/LightningComponentResource/index.md)  
[An LWC must have a description](./Sample%20Rules/LightningComponentResource/index.md)  

### OmniUiCard
[Flexcards must have a description](./Sample%20Rules/OmniUiCard/index.md)  

### OmniProcess
[OmniProcess must have less than 100 elements](./Sample%20Rules/OmniProcess/index.md)  


