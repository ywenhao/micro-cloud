import { webUpdateNotice } from '@plugin-web-update-notification/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import type { PluginOption } from 'vite'

import { createViteAutoImportPlugin } from './auto-import'
import { createHtmlVitePlugin } from './html'
import { configSvgIconsPlugin } from './svgSprite'
import { configVisualizerConfig } from './visualizer'

export const createVitePlugins = (
  env: ImportMetaEnv,
  appName: string,
  isBuild: boolean
) => {
  const plugins: PluginOption[] = [
    vue({
      script: {
        defineModel: true
      },
      template: {
        compilerOptions: {
          isCustomElement: tag => /^micro-app/.test(tag)
        }
      }
    }),
    vueJsx(),
    UnoCSS()
  ]

  plugins.push(...createViteAutoImportPlugin())
  // vite-plugin-svg-icons
  plugins.push(configSvgIconsPlugin(isBuild, appName))

  // vite-plugin-html
  plugins.push(createHtmlVitePlugin(env, isBuild))

  // rollup-plugin-visualizer
  plugins.push(configVisualizerConfig())

  plugins.push(
    webUpdateNotice({
      hiddenDefaultNotification: true,
      hiddenDismissButton: true,
      versionType: 'git_commit_hash'
    })
  )
  // @vitejs/plugin-legacy
  isBuild && plugins.push(legacy())
  return plugins
}
