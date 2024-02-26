
# @sf-explorer/devops.cli

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
