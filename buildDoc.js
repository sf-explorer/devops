const rules = require('./defaultRules')
const { ruleDetail } = require('./index.js')
const { file } = require("@polycuber/script.cli")

var indexContent = ''

const rulesByObject = rules.reduce((prev, cur) => {
    if (!prev[cur.sObject]) {
        prev[cur.sObject] = []
    }
    prev[cur.sObject].push(cur)
    return prev
}, {})



Object.keys(rulesByObject).forEach(objectName => {
    const rules = rulesByObject[objectName]


    const rulesIndexContent = rules.map(rule => `[${rule.message}](./Sample Rules/${objectName}/index.md)  `).join('\n')
    indexContent = indexContent + `### ${objectName}
${rulesIndexContent}

`
    const content = rules.map(ruleDetail).join('\n')
    file.write.text(`./Sample Rules/${objectName}/index.md`, `# ${objectName}
${content}`)
})
file.write.text('./Sample Rules/index.md', indexContent)