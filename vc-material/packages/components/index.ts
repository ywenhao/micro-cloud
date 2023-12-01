import * as components from './src/index'
export * from './src/index'
import type { App } from 'vue'

export default {
  install: (app: App) => {
    for (const c in components) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comp = (components as any)[c]
      if (comp?.install) {
        app.component(comp.name, comp)
      }
    }
  }
}
