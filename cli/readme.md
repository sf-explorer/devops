
# @sf-explorer/devops.cli


## Pre-requisite
- nodejs
- sf or sfdx connected on a default org

## Pipeline integration

Run the command:  
```cmd
npx @sf-explorer/devops.cli -o myOrg -d 2024-03-01 --exclude '@Sys admin' --exclude 'CustomField.*_del'
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

