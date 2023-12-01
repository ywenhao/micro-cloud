// uno.config.ts
import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import type { Preset } from 'unocss'
import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetWebFonts
} from 'unocss'

import { borderColorRules, unoColors, webFontsOptions } from './build/vars'

export default defineConfig({
  shortcuts: {
    'auth-logo': 'w-96px h-26px',
    'table-box': 'mt-4 flex-1'
    // 'vca-layout': 'w-screen h-screen overflow-hidden',
    // 'vca-layout__header':
    //   'h-[52px] flex items-center shadow-normal z-10 pl-6 pr-5',
    // 'vca-layout__main': 'bg-[#f2f3f5] p-0! overflow-hidden'
  },
  rules: [...borderColorRules],
  theme: {
    boxShadow: {
      normal: '0px 2px 6px rgba(29, 33, 41, 0.05)'
    },
    colors: unoColors
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetRemToPx() as Preset<{}>,
    presetWebFonts({
      ...webFontsOptions
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
