import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import zh from '../src/locales/zh.js'
import en from '../src/locales/en.js'
import ar from '../src/locales/ar.js'
import ckb from '../src/locales/ckb.js'

function flatten(object, prefix = '', out = new Set()) {
  for (const [key, value] of Object.entries(object)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') flatten(value, path, out)
    else out.add(path)
  }
  return out
}

const flat = { zh: flatten(zh), en: flatten(en), ar: flatten(ar), ckb: flatten(ckb) }
const problems = []

for (const lang of ['en', 'ar', 'ckb']) {
  const missing = [...flat.zh].filter((key) => !flat[lang].has(key))
  const extra = [...flat[lang]].filter((key) => !flat.zh.has(key))
  if (missing.length) problems.push(`${lang} 缺少词条: ${missing.join(', ')}`)
  if (extra.length) problems.push(`${lang} 多余词条: ${extra.join(', ')}`)
}

const files = []
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.(vue|js)$/.test(entry)) files.push(path)
  }
}
walk('src')

const used = new Set()
for (const file of files) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(/(?<![A-Za-z0-9_$.])\$?t\(\s*'([A-Za-z0-9_.]+)'/g)) used.add(match[1])
}

const unresolved = [...used].filter((key) => !flat.zh.has(key)).sort()
if (unresolved.length) problems.push(`模板引用了不存在的词条: ${unresolved.join(', ')}`)

console.log(`词条总数 zh=${flat.zh.size} en=${flat.en.size} ar=${flat.ar.size} ckb=${flat.ckb.size}`)
console.log(`模板静态引用词条 ${used.size} 个`)
if (problems.length) {
  console.log(problems.join('\n'))
  process.exitCode = 1
} else {
  console.log('OK 四语词条一致，模板引用全部可解析')
}
