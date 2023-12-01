/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'

import openapiTS from 'openapi-typescript'

const rootDir = process.cwd()
const schemaPath = path.join(rootDir, './schema')
const services = [
  {
    // name: 'pedestal',
    name: 'all',
    url: 'http://192.168.2.205:30125/swagger-ui/apidocs.swagger.json'
  }
]

const prefix = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
`

function gen() {
  if (!fs.existsSync(schemaPath)) {
    fs.mkdirSync(schemaPath)
  }

  services.forEach(async ({ name, url }) => {
    const output = await openapiTS(url, { version: 2 }).catch(console.log)
    if (output?.length > 195) {
      const filePath = path.join(schemaPath, `./${name}.ts`)
      fs.writeFileSync(filePath, prefix + output)
      // console.log(`生成dts文件: ${filePath}`)
    }
  })
}

gen()
