// uno.config.ts
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { defineConfig, presetUno } from 'unocss'
import { unoColors } from './site/vars'
export default defineConfig({
  theme: {
    colors: unoColors
  },
  presets: [presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
