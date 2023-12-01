import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import { createVitePlugins } from '../../build/config'
import { basicBuild } from '../../build/config/build'
import { createViteCss } from '../../build/config/css'
import { loadVcEnv } from '../../build/utils'
import { envDir, outDir, ports } from '../../build/utils/paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadVcEnv(mode, envDir)
  const isBuild = command === 'build'
  return {
    envDir,
    css: createViteCss(),
    build: basicBuild(outDir.pedestal),
    clearScreen: false,
    server: { host: true, port: ports.pedestal, open: false },
    plugins: createVitePlugins(env, 'pedestal', isBuild),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
