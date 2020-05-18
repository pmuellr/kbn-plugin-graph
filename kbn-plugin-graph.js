#!/usr/bin/env node

'use strict'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const DefaultIndexName = 'kbn-plugin-graph'
const DefaultESURL = 'http://elastic:changeme@localhost:9200'

const ESURL = process.env.ES_URL || DefaultESURL

const { Client } = require('@elastic/elasticsearch')

/** @typedef { import("./lib/types").Plugin } Plugin */

const pluginsAPI = require('./lib/plugins-api')

setImmediate(main);

async function main() {
  const indexName = DefaultIndexName

  console.log(`reading plugin files`)
  const plugins = await pluginsAPI.getPlugins()

  const client = new Client({ node: ESURL  })
  await deleteOldIndex(client, indexName)
  await addNewEntries(client, indexName, Array.from(plugins.values()))
  console.log(`wrote ${plugins.size} plugin documents to ${indexName}`)
}

/** @type { (client: Client, indexName: string, plugins: Plugin[]) => Promise<void> } */
async function addNewEntries(client, indexName, plugins) {
  const body = []

  for (const plugin of plugins.values()) {
    body.push({ index: { _id: plugin.id }})
    body.push({ plugin })
  }

  try {
    await client.bulk({
      index: indexName,
      body
    })
  } catch(err) {
    console.log(`error writing data to index "${indexName}": ${err.message}`)
    process.exit(1)
  }
}

/** @type { (client: Client, indexName: string) => Promise<void> } */
async function deleteOldIndex(client, indexName) {
  try {
    await client.indices.delete({
      index: indexName,
      ignore_unavailable: true,
      allow_no_indices: true,
    })
  } catch(err) {
    console.log(`error deleting index "${indexName}": ${err.message}`)
  }
}
