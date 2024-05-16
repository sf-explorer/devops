
# @sf-explorer/devops.cli

## Pipeline integration
Create a file named `.env` with the following content:
```bash
SFEXP_LOGIN=XXX # remove it to use SFDX instead
SFEXP_PASSWORD=XXX # Password+SecurityToken, remove it to use SFDX instead
LOGINURL=https://login.salesforce.com #or https://test.salesforce.com
DATE=TODAY  #or 2024-01-01
RULES=EntityDefinition,CustomField  #specify to only run rules on EntityDefinition and CustomField - remove param to check all rules
```
To connect with SFDX, don't use the `SFEXP_LOGIN`/`SFEXP_PASSWORD` env var.

Run the command:  
```cmd
npx @sf-explorer/devops.cli -o myOrg -d 2024-03-01 --exclude-author '@Sys admin'
```
The command will generate an output file name `testReport.xml` similar to the one you can find [here](./cli/test-report.xml).

__Options__
```
Options:
      --version         Show version number                            [boolean]
  -d, --from-date       From date execution, in format YYYY-MM-DD
                                                         [default: "2024-04-01"]
  -e, --exclude         Exclude specified author, in format @name, multiple
                        values are supported
  -o, --target-org      Username or alias of the target org. Not required if the
                        `target-org` configuration variable is already set.
  -u, --sfdx-url       sfdx auth url
  -r, --print-rules     Print rules
  -h, --help            Show help                                      [boolean]
```


## Ignore metadata
You can ignore specific errors with a file named `.sfexplorerignore` (using regex similar to a .gitignore file)
- ignore an author with @ and the author name
- ignore a record with its type and target

