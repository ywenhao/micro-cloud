import type { WebFontsOptions } from '@unocss/preset-web-fonts'

/** 变量 */
export const vars: Record<string, string> = {
  // 品牌色 / 常规
  'primary-6': '#2253e6',
  // 品牌色 / 悬浮
  'primary-5': '#4080ff',
  // 品牌色 / 点击
  'primary-7': '#0e42d2',
  // 品牌色 / 特殊场景
  'primary-4': '#6aa1ff',
  // 品牌色 / 一般禁用
  'primary-3': '#94bfff',
  // 品牌色 / 文字禁用
  'primary-2': '#bedaff',
  // 品牌色 / 浅色/白底悬浮
  'primary-1': '#e8f3ff',
  // 链接 / 常规
  'link-6': '#2253e6',
  // 链接 / 悬浮
  'link-5': '#4080ff',
  // 链接 / 点击
  'link-7': '#0e42d2',
  // 链接 / 特殊场景
  'link-4': '#6aa1ff',
  // 链接 / 一般禁用
  'link-3': '#94bfff',
  // 链接 / 文字禁用
  'link-2': '#bedaff',
  // 链接 / 浅色/白底悬浮
  'link-1': '#e8f3ff',
  // 错误 / 常规
  'danger-6': '#f53f3f',
  // 错误 / 悬浮
  'danger-5': '#f76560',
  // 错误 / 点击
  'danger-7': '#cb272d',
  // 错误 / 禁用
  'danger-4': '#f98981',
  // 错误 / 一般禁用
  'danger-3': '#fbaca3',
  // 错误 / 文字禁用
  'danger-2': '#fdcdc5',
  // 错误 / 浅色背景
  'danger-1': '#ffece8',
  // 成功 / 常规
  'success-6': '#00b42a',
  // 成功 / 悬浮
  'success-5': '#23c343',
  // 成功 / 点击
  'success-7': '#009a29',
  // 成功 / 特殊场景
  'success-4': '#4cd263',
  // 成功 / 一般禁用
  'success-3': '#7be188',
  // 成功 / 文字禁用
  'success-2': '#aff0b5',
  // 成功 / 浅色背景
  'success-1': '#e8ffea',
  // 警示 / 常规
  'waring-6': '#ff7d00',
  // 警示 / 悬浮
  'waring-5': '#ff9a2e',
  // 警示 / 点击
  'waring-7': '#d25f00',
  // 警示 / 特殊场景
  'waring-4': '#ffb65d',
  // 警示 / 一般禁用
  'waring-3': '#ffcf8b',
  // 警示 / 文字禁用
  'waring-2': '#ffe4ba',
  // 警示 / 浅色背景
  'waring-1': '#fff7e8',
  // 边框 / 浅色
  'color-border-1': '#f2f3f5',
  // 边框 / 一般
  'color-border-2': '#e5e6eb',
  // 边框 / 深/悬浮
  'color-border-3': '#c9cdd4',
  // 边框 / 重/按钮描边
  'color-border-4': '#86909c',
  // 填充 / 浅/禁用
  'color-fill-1': '#f7f8fa',
  // 填充 / 一般/常规/白底悬浮
  'color-fill-2': '#f2f3f5',
  // 填充 / 深/灰底悬浮
  'color-fill-3': '#e5e6eb',
  // 填充 / 重/特殊场景
  'color-fill-4': '#c9cdd4',
  // 填充 / 强调/图标/特殊场景
  'color-fill-5': '#4e5969',
  // 文字 / 置灰信息
  'color-text-4': '#c9cdd4',
  // 文字 / 次要信息
  'color-text-3': '#86909c',
  // 文字 / 次强调/正文标题
  'color-text-2': '#4e5969',
  // 文字 / 强调/正文标题
  'color-text-1': '#1d2129'
}

/** unocss theme 加入 bg-* text-* */
export const unoColors: Record<string, string> = Object.keys(vars).reduce(
  (pre, curr) => {
    if (curr.startsWith('color-border')) return pre
    let key = curr
    if (curr.startsWith('color-text-')) {
      key = curr.replace('color-text', 'ct')
    } else if (curr.startsWith('color-fill-')) {
      key = curr.replace('color-fill', 'fill')
    }

    if (key.endsWith('-6')) key = key.replace('-6', '')
    return Object.assign(pre, { [key]: vars[curr] })
  },
  {}
)

/** unocss rules 加入border color */
export const borderColorRules = Object.entries(vars).reduce(
  (res, [key, value]) => {
    if (key.startsWith('color-border-')) {
      const index = key.split('-')[2]
      const css = { 'border-color': value }
      res.push([`border-color-${index}`, css])
    }
    return res
  },
  [] as [string, Record<string, string | number>][]
)

export const webFontsOptions: WebFontsOptions = {
  provider: 'none',
  fonts: {
    'big-num': ['big-num', 'sans-serif'],
    pingfangsc: ['pingfangsc', 'sans-serif']
  }
}
