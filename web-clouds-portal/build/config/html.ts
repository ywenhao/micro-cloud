/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export function createHtmlVitePlugin(
  env: ImportMetaEnv,
  isBuild: boolean
): PluginOption {
  // const { VITE_APP_TITLE } = env
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
          children: `;(function () {
        document.title = localStorage.getItem('__title__') || ''
      })()`
        }
      ]
    }
  })
}
