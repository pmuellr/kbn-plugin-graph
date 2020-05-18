'use strict'

/** @typedef { import("./types").Plugin } Plugin */

const fs = require('fs')
const path = require('path')

const globby = require('globby')

module.exports = {
  getPlugins,
}

/** @type { () => Promise<Map<string, Plugin>> } */
async function getPlugins() {
  const pluginFiles = await getPluginFiles()

  const result = new Map()
  for (let pluginFile of pluginFiles) {
    let plugin
    try {
      plugin = readPluginFile(pluginFile)
    } catch (err) {
      console.log(`ignoring plugin file "${pluginFile}": ${err.message}`)
      continue
    }

    result.set(plugin.id, plugin)
  }

  return result
}

/** @type { (pluginFile: string) => Plugin } */
function readPluginFile(pluginFile) {
  const baseDir = path.dirname(path.dirname(pluginFile))

  let content, object

  try {
    content = fs.readFileSync(pluginFile, 'utf8')
  } catch (err) {
    throw new Error(`error reading file: ${err.message}`)
  }

  try {
    object = JSON.parse(content)
  } catch (err) {
    throw new Error(`error parsing JSON: ${err.message}`)
  }

  if (object.id == null) {
    throw new Error(`no id in plugin file`)
  }

  /** @type { string[] } */
  const requiredPlugins = object.requiredPlugins || []
  /** @type { string[] } */
  const optionalPlugins = object.optionalPlugins || []
  const plugins = requiredPlugins.concat(optionalPlugins)

  return {
    baseDir,
    id: object.id,
    ui: !!object.ui,
    server: !!object.server,
    requiredPlugins,
    optionalPlugins,
    plugins,
  }
}

async function getPluginFiles() {
  try {
    return await globby(['**/kibana.json', '!**/build/**', '!**/template/**'])
  } catch (err) {
    console.log(`error searching for kibana.json files: ${err.message}`)
    process.exit(1)
  }
}
