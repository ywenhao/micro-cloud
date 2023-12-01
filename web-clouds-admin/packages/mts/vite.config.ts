import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import { createVitePlugins } from '../../build/config'
import { basicBuild } from '../../build/config/build'
import { loadVcEnv } from '../../build/utils'
import { envDir, outDir, ports } from '../../build/utils/paths'

const appName = 'mts'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadVcEnv(mode, envDir)
  const isBuild = command === 'build'
  return {
    envDir,
    base: `/${appName}`,
    build: basicBuild(outDir[appName]),
    clearScreen: false,
    server: { host: true, port: ports[appName] },
    plugins: createVitePlugins(env, appName, isBuild),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
