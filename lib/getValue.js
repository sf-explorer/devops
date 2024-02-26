const { parse } = require('comment-parser')

var dotGet = function (str, obj) {
    return str.split('.').reduce(function (cur, i) {
        if (!cur) return undefined
        if (typeof cur === 'string') {
            // try to parse either the comment or the json...
            if (i === 'api') {
                const table= cur.split('__')
                if (table.length === 2) {
                    return table[0]
                }
                if (table.length === 3) {
                    return table[1]
                }
                return table[0]
            }

            if (cur.indexOf('/*') > -1) {
                const comment = mainComment(cur)
                return comment[i]
            } else if (cur.startsWith('{') && cur.endsWith('}')) {
                try {
                    const d = JSON.parse(cur)
                    if (d) {
                        return d[i]
                    }
                } catch (e) {
                    return null
                }
            } else {
                return null
            }
        }
        return cur[i]
    }, obj)
}

function reduceTags(comment){
    return comment?.tags?.reduce((prev, tag)=>{
        prev[tag.tag] = tag.name + ' ' + tag.description
        return prev
    }, comment) || comment
}

function mainComment(body) {
    try {
        const comments = parse(body)
        return comments.length > 0 ? reduceTags(comments[0]) : {
            description: '',
            tags: [],
        }
    } catch (e) {
        console.error(e)
        return {
            description: '',
            tags: [],
        }
    }
}

function getValue(record, rule) {
    if (rule.computedField) {
        return dotGet(rule.computedField, record) || ''
    } else {
        return record[rule.field] || ''
    }
}

module.exports = getValue