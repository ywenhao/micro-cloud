import type { VcFilterBarScheme } from 'vc-material'

import {
  brandOptions,
  statusApplyOptions,
  statusOwnedOptions,
  verifyOptions
} from './options'
export const filterBarScheme = computed(
  () =>
    (isApply: boolean = true, is_own: number = 2) => {
      const statusOptions = isApply
        ? statusApplyOptions
        : is_own === 2
        ? statusOwnedOptions
        : statusOwnedOptions.filter(
            item => ![2, 3, 4].includes(item.value as number)
          )
      const filterBar: VcFilterBarScheme = {
        widgets: [
          {
            field: 'brand',
            widget: 'select',
            attrs: {
              placeholder: '全部品牌',
              options: brandOptions
            }
          },
          {
            field: 'is_verify',
            widget: 'select',
            attrs: {
              placeholder: '全部验证方式',
              options: verifyOptions
            }
          },
          {
            field: 'status',
            widget: 'select',
            attrs: {
              placeholder: '全部状态',
              options: statusOptions
            }
          },
          {
            field: 'user_id',
            widget: 'input',
            attrs: {
              placeholder: '请输入用户ID'
            }
          },
          {
            field: 'keywords',
            widget: 'combo-input',
            attrs: {
              defaultSelected: 'desc_keyword',
              options: [
                {
                  label: '证书备注名',
                  value: 'desc_keyword',
                  placeholder: '请输入证书备注名',
                  maxLength: 20
                },
                {
                  label: '绑定域名',
                  value: 'domain_keyword',
                  placeholder: '请输入绑定域名',
                  maxLength: 253
                }
              ],
              maxLength: 20,
              width: '193px'
            }
          }
        ]
      }
      const ownFilterBar: VcFilterBarScheme = {
        widgets: [
          {
            field: 'status',
            widget: 'select',
            attrs: {
              placeholder: '全部状态',
              options: statusOptions
            }
          },
          {
            field: 'user_id',
            widget: 'input',
            attrs: {
              placeholder: '请输入用户ID'
            }
          },
          {
            field: 'keywords',
            widget: 'combo-input',
            attrs: {
              defaultSelected: 'desc_keyword',
              options: [
                {
                  label: '证书备注名',
                  value: 'desc_keyword',
                  placeholder: '请输入证书备注名',
                  maxLength: 20
                },
                {
                  label: '绑定域名',
                  value: 'domain_keyword',
                  placeholder: '请输入绑定域名',
                  maxLength: 253
                }
              ],
              placeholder: '请输入用户ID',
              width: '193px',
              changeSearch: true
            }
          }
        ]
      }

      return is_own === 1 ? ownFilterBar : filterBar
    }
)
