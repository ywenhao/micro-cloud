import * as fs from 'fs'
import openapiTS from 'openapi-typescript'
import { join } from 'path'

// import { apisDir } from '../../build/utils/paths'

const services = [
  {
    name: 'all',
    url: 'http://192.168.2.205:30126/swagger-ui/apidocs.swagger.json'
  }
]

const prefix = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
`

function gen() {
  const apisDir = join(process.cwd(), 'packages/apis')
  if (!fs.existsSync(join(apisDir, './schema'))) {
    fs.mkdirSync(join(apisDir, './schema'))
  }

  services.forEach(async ({ name, url }) => {
    const output = await openapiTS(url, { version: 2 }).catch(console.log)
    if (output?.length > 195) {
      const filePath = join(apisDir, `./schema/${name}.ts`)
      fs.writeFileSync(filePath, prefix + output)
      console.log(`生成dts文件: ${filePath}`)
    }
  })
}

gen()
