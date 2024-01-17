const rules = require('./defaultRules')
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
`
}

Object.keys(rulesByObject).forEach(key => {
    const rules = rulesByObject[key]


    const rulesIndexContent = rules.map(rule => `[${rule.message}](./rules/${key}/index.md)  `).join('\n')
    indexContent = indexContent + `### ${key}
${rulesIndexContent}

`
    const content = rules.map(ruleDetail).join('\n')
    file.write.text(`./rules/${key}/index.md`, `# ${key}
${content}`)
})
file.write.text('./rules/index.md', indexContent)