import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

import { VcMaterialResolver } from './vcMaterialResolver'

export function createViteAutoImportPlugin() {
  return [
    //  AutoImport({
    //   vueTemplate: true,
    //   imports: ['vue', 'vue-router', '@vueuse/core'],
    //   dirs: ['./src/hooks/*', './src/utils/*', './src/stores/*'],
    //   dts: './types/auto-imports.d.ts',
    //   resolvers: [ArcoResolver({ importStyle: false })]
    // }),
    // Components({
    //   dirs: ['src/components'],
    //   dts: './types/components.d.ts',
    //   resolvers: [
    //     ArcoResolver({
    //       importStyle: false,
    //       sideEffect: true
    //     })
    //   ]
    // }),
    AutoImport({
      vueTemplate: true,
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dirs: ['./src/config', './src/utils/**', './src/stores/modules'],
      // dirs: [_path('./src/config'), _path('./src/utils'), _path('./src/hooks')],
      dts: './typings/auto-imports.d.ts',
      resolvers: [ArcoResolver({ importStyle: false }), VcMaterialResolver()]
    }),
    Components({
      dirs: ['./src/components/automatic'],
      dts: './typings/components.d.ts',
      resolvers: [
        ArcoResolver({ importStyle: false, sideEffect: true }),
        VcMaterialResolver()
      ]
    })
  ]
}
