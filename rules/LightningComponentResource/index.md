# LightningComponentResource
### An LWC must have an author
Field: `Source`

### Config to use
```json
{
  "sObject": "LightningComponentResource",
  "field": "Source",
  "computedField": "author",
  "when": "ManageableState = 'unmanaged' and FilePath like '%js'",
  "nameField": "FilePath",
  "tooling": true,
  "message": "An LWC must have an author"
}
```

### An LWC must have a description
Field: `Source`

### Config to use
```json
{
  "sObject": "LightningComponentResource",
  "field": "Source",
  "computedField": "description",
  "when": "ManageableState = 'unmanaged' and FilePath like '%js'",
  "nameField": "FilePath",
  "tooling": true,
  "message": "An LWC must have a description"
}
```
