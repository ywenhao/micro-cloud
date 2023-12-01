// TODO:转码及存储校验

import type { FieldRule } from '@arco-design/web-vue'

export const ssl_max_certificate_count: FieldRule = {
  required: true,
  message: '请输入可申请证书数量'
}

export const ssl_max_domain_count: FieldRule = {
  required: true,
  message: '请输入可申请域名数量'
}

export const cdn_max_site_count: FieldRule = {
  required: true,
  message: '请输入可创建站点数'
}
export const cdn_speed_limit: FieldRule = {
  required: true,
  message: '请输入带宽限速'
}
export const dns_max_domain_count: FieldRule = {
  required: true,
  message: '请输入可添加域名数'
}
export const dns_max_rr_count_per_domain: FieldRule = {
  required: true,
  message: '请输入单个域名解析记录数量'
}
