import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import { createVitePlugins } from '../../build/config'
import { basicBuild } from '../../build/config/build'
import { outDir, rootDir } from '../../build/utils/paths'
import { ports } from '../../build/utils/ports'

const appName = 'ssl'
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const envPath = resolve(rootDir, 'env')
  const env = loadEnv(mode, envPath) as ImportMetaEnv

  const isBuild = command === 'build'
  return {
    clearScreen: false,
    server: {
      host: true,
      port: ports[appName]
    },
    envDir: envPath,
    base: `/${appName}`,
    build: basicBuild(outDir[appName]),
    plugins: createVitePlugins(env, appName, isBuild),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
