const rules = require('./defaultRules')
const {soqlFromRule} = require('./index.js')
const { file } = require("@polycuber/script.cli")

var indexContent = ''

const rulesByObject = rules.reduce((prev, cur) => {
    if (!prev[cur.sObject]) {
        prev[cur.sObject] = []
    }
    prev[cur.sObject].push(cur)
    return prev
}, {})

function ruleDetail(rule) {
    const regex = rule.regex? `regex: \`${rule.regex}\`  
`: ''
    const goodExample = rule.goodExample ? `#### Example
${rule.goodExample}  ` : ''
    return `### ${rule.message}
${regex}Field: \`${rule.field}\`
${goodExample}
### Config to use
\`\`\`json
${JSON.stringify(rule, null, 2)}
\`\`\`

### SOQL Generated
\`\`\`sql
${soqlFromRule(rule, '2024-01-01')}
\`\`\`
`
}

Object.keys(rulesByObject).forEach(objectName => {
    const rules = rulesByObject[objectName]


    const rulesIndexContent = rules.map(rule => `[${rule.message}](./rules/${objectName}/index.md)  `).join('\n')
    indexContent = indexContent + `### ${objectName}
${rulesIndexContent}

`
    const content = rules.map(ruleDetail).join('\n')
    file.write.text(`./rules/${objectName}/index.md`, `# ${objectName}
${content}`)
})
file.write.text('./rules/index.md', indexContent)