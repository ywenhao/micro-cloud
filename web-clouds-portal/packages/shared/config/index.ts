export * from './setup'

export const products = [
  { symbol: 'oss', name: '对象存储', icon: 'product-oss' },
  { symbol: 'mts', name: '云转码', icon: 'product-mts' },
  { symbol: 'cdn', name: 'CDN', icon: 'product-cdn' },
  { symbol: 'dns', name: '云解析DNS', icon: 'product-dns' },
  { symbol: 'ssl', name: 'SSL/TLS证书', icon: 'product-ssl' }
]

export const isDev = import.meta.env.DEV

export const DEV_SUB_PORT_MAP: Record<string, number> = {
  dns: 10021,
  ssl: 10022,
  cdn: 10023,
  oss: 10024,
  mts: 10025
}
