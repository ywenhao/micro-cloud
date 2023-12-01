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
    'page-title': `font-500 text-16px line-height-22px`,
    'auth-logo': 'w-[96px] h-[26px]',
    'vcp-layout': 'w-full h-screen overflow-hidden flex flex-col',
    'vcp-layout__header':
      'h-[52px]! flex items-center shadow-normal z-10 px-20px',
    'vcp-layout__main': 'overflow-hidden flex-1 p-0',
    'flex-col-1': 'flex flex-col flex-1',
    'table-box': 'mt-4 flex-1'
    // 'table-box': 'mt-4 flex-1 basis-0 overflow-auto'
  },
  rules: [...borderColorRules],
  theme: {
    boxShadow: {
      normal: '0px 4px 10px rgba(29, 33, 41, 0.1)'
    },
    colors: {
      ...unoColors
    }
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
