import type { CSSOptions } from 'vite'

import { unoColors } from '../vars'

export const createViteCss = (): CSSOptions => {
  return {
    preprocessorOptions: {
      less: {
        modifyVars: unoColors,
        javascriptEnabled: true
      }
    }
  }
}
