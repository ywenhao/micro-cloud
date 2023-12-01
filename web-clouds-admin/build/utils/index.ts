import { loadEnv } from 'vite'

export function loadVcEnv(
  mode: string,
  envDir: string,
  prefixes?: string | string[]
): ViteEnv {
  return loadEnv(mode, envDir, prefixes) as unknown as ViteEnv
}
