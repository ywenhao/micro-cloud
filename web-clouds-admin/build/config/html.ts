/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export function createHtmlVitePlugin(
  env: ViteEnv,
  isBuild: boolean
): PluginOption {
  const { VITE_APP_TITLE } = env
  return createHtmlPlugin({
    minify: isBuild,
    /**
     * Data that needs to be injected into the index.html ejs template
     */
    inject: {
      tags: [
        {
          injectTo: 'head',
          tag: 'script',
          attrs: {
            id: 'tag'
          },
          children: `;(function () {
            document.title = localStorage.getItem('__VCA_TITLE__') || 'VCloud管理系统'
          })()`
        }
      ],
      data: {
        VITE_APP_TITLE
      }
    }
  })
}
