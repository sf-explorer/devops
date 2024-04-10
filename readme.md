# SF Explorer Devops Rules

A set of [declarative rules](./defaultRules.js) allowing to perform simple checks on your orgs with SF Explorer Engine

## Pipeline integration
Create a file named `.env` with the following content:
```bash
SFEXP_LOGIN=XXX # remove it to use SFDX instead
SFEXP_PASSWORD=XXX # Password+SecurityToken, remove it to use SFDX instead
LOGINURL=https://login.salesforce.com #or https://test.salesforce.com
DATE=TODAY  #or 2024-01-01
RULES=EntityDefinition,CustomField  #specify to only run rules on EntityDefinition and CustomField - remove param to check all rules
```

Run the command:  
```cmd
npx @sf-explorer/devops.cli
```
The command will generate an output file name `testReport.xml` similar to the one you can find [here](./cli/test-report.xml).


If you don't provide a username, it will try to connect using `SF` or `SFDX` targeting your default org.

### EntityDefinition
[A custom object Name must be in english and PascalCase](./Sample%20Rules/EntityDefinition/index.md)  
[A custom object Description is required](./Sample%20Rules/EntityDefinition/index.md)  
[Less than 100 custom fields](./Sample%20Rules/EntityDefinition/index.md)  
[Maximum one custom trigger per object](./Sample%20Rules/EntityDefinition/index.md)  
[Maximum 15 record types per object](./Sample%20Rules/EntityDefinition/index.md)  

### CustomField
[A CustomField API Name must be in english and PascalCase](./Sample%20Rules/CustomField/index.md)  
[Custom Fields must have a Description (at least 20 chars)](./Sample%20Rules/CustomField/index.md)  

### Flow
[Flow Description is required (at least 20 chars)](./Sample%20Rules/Flow/index.md)  
[Flow Label must be Short Yet Meaningful](./Sample%20Rules/Flow/index.md)  

### PermissionSet
[Name is following project convention](./Sample%20Rules/PermissionSet/index.md)  
[Description is required (more than 20 chars)](./Sample%20Rules/PermissionSet/index.md)  

### ApexClass
[An Apex class name must be PascalCase and use a correct Suffix](./Sample%20Rules/ApexClass/index.md)  
[An ApexClass must follow the best practices](./Sample%20Rules/ApexClass/index.md)  
[An ApexClass must have a Description](./Sample%20Rules/ApexClass/index.md)  
[An ApexClass must have an author](./Sample%20Rules/ApexClass/index.md)  
[Apex variables must be camelCase](./Sample%20Rules/ApexClass/index.md)  
[Apex methods must be camelCase](./Sample%20Rules/ApexClass/index.md)  

### LightningComponentResource
[An LWC must have an author](./Sample%20Rules/LightningComponentResource/index.md)  
[An LWC must have a description](./Sample%20Rules/LightningComponentResource/index.md)  

### FieldPermissions
[No field level security on Profiles (except System Administrator)](./Sample%20Rules/FieldPermissions/index.md)  

### Flexcards
[Flexcards names must be pascal case](./Sample%20Rules/OmniUiCard/index.md)  
[Flexcards must have a description](./Sample%20Rules/OmniUiCard/index.md)  

### Omniscript
[Omniscript Type should be camel case (for LWC compatibility)](./Sample%20Rules/OmniProcess/index.md)  
[Omniscript SubType must be PascalCase](./Sample%20Rules/OmniProcess/index.md)  
[Omniscripts must have a description](./Sample%20Rules/OmniProcess/index.md)  
[Omniscript must have less than 100 elements](./Sample%20Rules/OmniProcess/index.md)  

### Omniscript Elements
[Remote action and DataRaptor Actions must have a description](./Sample%20Rules/OmniProcessElement/index.md)  
[Set Values and Set Errors must start with Set+PascalCase](./Sample%20Rules/OmniProcessElement/index.md)  
[Remote Action must start with 'Invoke+PascalCase'](./Sample%20Rules/OmniProcessElement/index.md)  
[DataRaptor Extract must start with 'DRE+PascalCase'](./Sample%20Rules/OmniProcessElement/index.md)  
[DataRaptor Post must start with 'DRP+PascalCase'](./Sample%20Rules/OmniProcessElement/index.md)  
[DataRaptor Extract must start with 'IP+PascalCase'](./Sample%20Rules/OmniProcessElement/index.md)  

### Dataraptors
[DataRaptors must have a description](./Sample%20Rules/OmniDataTransform/index.md)  
