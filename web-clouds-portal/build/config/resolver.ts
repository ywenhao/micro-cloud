function kebabCase(key: string) {
  const result = key.replace(/([A-Z])/g, ' $1').trim()
  return result.split(' ').join('-').toLowerCase()
}

export interface ImportInfo {
  as?: string
  name?: string
  from: string
}

export type SideEffectsInfo =
  | (ImportInfo | string)[]
  | ImportInfo
  | string
  | undefined

export interface ComponentInfo extends ImportInfo {
  sideEffects?: SideEffectsInfo
}
export interface ComponentResolverObject {
  type: 'component' | 'directive'
  // eslint-disable-next-line no-use-before-define
  resolve: ComponentResolverFunction
}

type Awaitable<T> = T | PromiseLike<T>
export type ComponentResolveResult = Awaitable<
  string | ComponentInfo | null | undefined | void
>
export type ComponentResolverFunction = (name: string) => ComponentResolveResult

export type ComponentResolver =
  | ComponentResolverFunction
  | ComponentResolverObject

export interface VcMaterialResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp | string | (RegExp | string)[]
}

const excludeStyles = ['svg-icon', 'config-provider', 'image']
function getSideEffects(
  partialName: string,
  options: VcMaterialResolverOptions
): SideEffectsInfo | undefined {
  const { importStyle = 'less' } = options
  if (excludeStyles.includes(partialName)) return []
  if (!importStyle) return

  if (importStyle === 'less') {
    return [`vc-material/theme-chalk/src/${partialName}.less`]
  } else {
    return [`vc-material/theme-chalk/${partialName}.css`]
  }
}

export function VcMaterialResolver(
  options: VcMaterialResolverOptions = {}
): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.exclude) {
        if (Array.isArray(options.exclude)) {
          if (options.exclude.some(item => name.match(item))) return
        } else {
          if (name.match(options.exclude)) return
        }
      }
      if (!name.match(/^Vc[A-Z]/)) return
      const compName = name.slice(2)
      const partialName = kebabCase(compName)

      return {
        name,
        // from: `vc-material/es/${partialName}`,
        from: `vc-material`,
        sideEffects: getSideEffects(partialName, options)
      }
    }
  }
}
