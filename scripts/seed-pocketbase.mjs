import { portalSeedRecords } from '../src/mock/portalContent.js'

const baseUrl = (process.env.VITE_POCKETBASE_URL || 'https://pb.51xyu.com').replace(/\/+$/, '')
const collection = process.env.VITE_POCKETBASE_COLLECTION || 'app_data'
const token = process.env.VITE_POCKETBASE_TOKEN || ''
const recordsUrl = `${baseUrl}/api/collections/${encodeURIComponent(collection)}/records`

function requestOptions(method, body) {
  return {
    method,
    headers: {
      ...(token ? { Authorization: token } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  }
}

async function findId(key) {
  const filter = encodeURIComponent(`key = ${JSON.stringify(key)}`)
  const response = await fetch(`${recordsUrl}?filter=${filter}&perPage=1`, requestOptions('GET'))
  if (!response.ok) throw new Error(`query failed: ${response.status} ${await response.text()}`)
  const result = await response.json()
  return result.items?.[0]?.id || ''
}

async function main() {
  let created = 0
  let updated = 0
  for (const record of portalSeedRecords) {
    const id = await findId(record.key)
    const response = id
      ? await fetch(`${recordsUrl}/${id}`, requestOptions('PATCH', { key: record.key, value: record.value }))
      : await fetch(recordsUrl, requestOptions('POST', { key: record.key, value: record.value }))
    if (!response.ok) {
      throw new Error(`${record.key}: ${response.status} ${await response.text()}`)
    }
    if (id) updated += 1
    else created += 1
    console.log(`${id ? 'updated' : 'created'} ${record.key}`)
  }
  console.log(`Done. created=${created}, updated=${updated}, total=${portalSeedRecords.length}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
