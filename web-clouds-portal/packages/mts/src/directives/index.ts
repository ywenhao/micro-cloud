import type { App, Directive } from 'vue'

const directives: Record<string, Directive> = import.meta.glob(
  './modules/**/*.ts',
  {
    eager: true,
    import: 'default'
  }
)

export function setupDirectives(app: App) {
  for (const key in directives) {
    const name = key.replace(/.+\/(.+)\.(.+)$/, '$1')
    const item = directives[key]
    app.directive(name, item)
  }
}
