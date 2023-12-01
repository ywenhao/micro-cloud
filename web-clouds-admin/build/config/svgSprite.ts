/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

import { createSvgIconsPlugin } from '@digitalacorn/vite-plugin-svg-icons'
import path from 'path'

export function configSvgIconsPlugin(isBuild: boolean, appName: string) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [
      path.resolve(process.cwd(), 'src/assets/icons'),
      path.resolve(process.cwd(), 'src/assets/svgs')
    ],
    svgoOptions: isBuild,
    // default
    symbolId:
      appName === 'pedestal'
        ? 'icon-[dir]-[name]'
        : `icon-${appName}-[dir]-[name]`,
    /**
     * custom dom id
     * @default: __svg__icons__dom__
     */
    // customDomId: '__vca_svg__icons__dom__',

    customDomId:
      appName === 'pedestal'
        ? `__vcloud_svg__icons__dom__`
        : `__vcloud_${appName}_svg__icons__dom__`,
    replaceStrokeWithCurrentColor: false
  })
  return svgIconsPlugin
}
