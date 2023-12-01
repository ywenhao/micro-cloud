import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

import { VcMaterialResolver } from './resolver'

export function createViteAutoImportPlugin() {
  return [
    AutoImport({
      vueTemplate: true,
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dirs: ['./src/stores/*', '../shared/*', './src/utils/*'],
      dts: './types/auto-imports.d.ts',
      resolvers: [ArcoResolver({ importStyle: false })]
    }),
    Components({
      dirs: ['../shared/components'],
      dts: './types/components.d.ts',
      resolvers: [
        ArcoResolver({
          importStyle: false,
          sideEffect: true
        }),
        VcMaterialResolver()
      ]
    })
  ]
}
