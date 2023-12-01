import { Message } from '@arco-design/web-vue'
import type { Directive, DirectiveHook } from 'vue'

const copyHtml = `
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
  <path fill="currentColor" d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"></path>
  <path fill="currentColor" d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"></path>
</svg>
`
const handler: DirectiveHook = (el: HTMLElement, binding) => {
  // 获取传递的参数
  const { arg, value } = binding
  el.classList.add('text-primary', 'cursor-pointer')
  // 根据参数是否为数字来决定显示的内容
  let content = arg === 'icon' ? copyHtml : '复制'
  if (arg === 'both') {
    content = `${copyHtml} <span class="ml-2 text-xs">复制</span>`
  }
  // 设置元素的 innerHTML
  el.innerHTML = content

  // 绑定元素的 click 事件
  el.addEventListener('click', function (e) {
    // 动态创建 textarea 标签
    const textarea = document.createElement('textarea')
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = true
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = value.toString()
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    // textarea.setSelectionRange(0, textarea.value.length);
    const result = document.execCommand('Copy')
    e.stopPropagation()
    if (result) {
      Message.success('复制成功')
    }
    document.body.removeChild(textarea)
  })
}

const copy: Directive = {
  mounted: handler
}

export default copy
