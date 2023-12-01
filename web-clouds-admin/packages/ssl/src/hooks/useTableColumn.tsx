import { Form, FormItem, Message } from '@arco-design/web-vue'
import {
  applyCancelApi,
  batchEditLicenseApi,
  deleteLicenseApi,
  downloadLicenseApi,
  editLicenseApi,
  revokeLicenseApi
} from '@vca/apis/src/ssl'
import { VcModal } from 'vc-material'
import type { VNodeChild } from 'vue'

import type { ApplyListItem } from '@/types/applyList'
import type { LicenseItem } from '@/types/licenseList'
import { dealDomain } from '@/utils/handleColumn'
import { downloadPem } from '@/utils/handleDownload'

interface CommonDrawState {
  visible: boolean
  loading: boolean
  record: any
}
export type Command =
  | 'details'
  | 'cancel'
  | 'download'
  | 'delete'
  | 'batchDelete'
  | 'revoke'
  | 'autoRenew'
  | 'autoRenewOpen'
  | 'autoRenewClose'
type TableRow = string[] | ApplyListItem | LicenseItem

interface ColumnResult {
  detailDraw: CommonDrawState
  applyDraw: any
  handleCommand: (command: Command, row: TableRow) => void
}
export default function useTableColumn(
  callback: () => void,
  deleteCallback?: (isBatch: boolean) => void
) {
  /**
   * 详情抽屉
   */
  const detailDraw = reactive<CommonDrawState>({
    visible: false,
    loading: false,
    record: undefined
  })

  const handleCommand = (command: Command, row: TableRow) => {
    let batchIds: string[] = []
    if (Array.isArray(row)) {
      batchIds = row
    } else {
      batchIds = []
    }
    const loading = ref<boolean>(false)
    const commandMap: Record<Command, () => void> = {
      details: () => {
        const record = row as ApplyListItem
        detailDraw.visible = true
        detailDraw.record = record.id
        callback()
      },
      cancel: () => {
        const content =
          batchIds.length > 0
            ? `确定要批量取消选中的 ${batchIds.length} 个证书申请吗？`
            : '确定要取消该证书申请吗？'

        const ids =
          batchIds.length > 0 ? batchIds : [(row as ApplyListItem)?.id ?? '']
        VcModal.confirm(
          {
            title: '取消证书申请',
            content: content,
            okLoading: loading.value
          },
          () => {
            loading.value = true

            return applyCancelApi({ id_list: ids })
              .then(() => {
                Message.success('取消成功')
                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      download: () => {
        const content =
          batchIds.length > 0
            ? `确定要批量下载选中的 ${batchIds.length} 个证书吗？`
            : '确定要下载该证书吗？'
        const ids =
          batchIds.length > 0 ? batchIds : [(row as LicenseItem)?.id ?? '']
        VcModal.confirm(
          {
            title: '确认下载证书',
            content: content,
            okLoading: loading.value
          },
          () => {
            loading.value = true
            return downloadLicenseApi({ id_list: ids })
              .then(res => {
                const name =
                  batchIds.length > 0
                    ? '批量下载证书'
                    : (row as LicenseItem).domain!
                const dataLength = res.zip?.length ?? 0
                if (dataLength < 1) {
                  Message.error('文件不存在')
                  return
                }
                downloadPem(res, name)
                Message.success('下载成功')
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      delete: () => {
        const content = (
          <div class="flex flex-col">
            <span>确定要删除该证书吗？</span>
            <span>
              请检查该证书在云分发 CDN、云存储
              OSS中是否仍在使用，以免引起云产品HTTPS访问业务中断。
            </span>
          </div>
        )
        const ids = [(row as LicenseItem)?.id ?? '']
        VcModal.error(
          {
            title: '确认删除证书',
            okLoading: loading.value,
            content: () => content
          },
          () => {
            loading.value = true
            return deleteLicenseApi({ id_list: ids })
              .then(() => {
                Message.success('删除成功')
                deleteCallback!(false)

                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      batchDelete: () => {
        const content = (
          <div class="flex flex-col">
            <span>{`确定要批量删除选中的${batchIds.length}个证书？`}</span>
            <span>
              请检查该证书在云分发 CDN、云存储
              OSS中是否仍在使用，以免引起云产品HTTPS访问业务中断。
            </span>
          </div>
        )
        VcModal.error(
          {
            title: '确认删除证书',
            okLoading: loading.value,
            content: () => content
          },
          () => {
            loading.value = true
            return deleteLicenseApi({ id_list: batchIds })
              .then(() => {
                Message.success('删除成功')
                deleteCallback!(true)
                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      autoRenew: () => {
        const record = row as LicenseItem
        const title = `确认${
          record.is_renewal === 2 ? '开启' : '关闭'
        }证书自动续期`
        const content =
          record.is_renewal === 2
            ? '开启后，将为即将到期或已过期证书自动发起续期申请，确定要开启证书自动续期吗？'
            : '关闭后，将停止为即将到期或已过期证书自动发起续期申请，确定要关闭证书自动续期吗？'
        const data: any = {
          id: record.id,
          is_renewal: record.is_renewal === 2 ? 1 : 2,
          des: record.desc
        }
        VcModal.confirm(
          {
            title: title,
            content: content
          },
          () => {
            loading.value = true

            return editLicenseApi(data)
              .then(() => {
                Message.success(
                  record.is_renewal === 2 ? '开启成功' : '关闭成功'
                )
                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      autoRenewOpen: () => {
        const title = '确认开启证书自动续期'
        const content = `确定要批量开启选中的${batchIds.length}个证书自动续期吗？`
        const data = {
          is_renewal: 1,
          id_list: batchIds
        }
        VcModal.confirm(
          {
            title: title,
            content: content
          },
          () => {
            loading.value = true

            return batchEditLicenseApi(data)
              .then(() => {
                Message.success('开启成功')
                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      autoRenewClose: () => {
        const title = '确认关闭证书自动续期'
        const content = `确定要批量关闭选中的${batchIds.length}个证书自动续期吗？`
        const data = {
          is_renewal: 2,
          id_list: batchIds
        }
        VcModal.confirm(
          {
            title: title,
            content: content
          },
          () => {
            loading.value = true

            return batchEditLicenseApi(data)
              .then(() => {
                Message.success('关闭成功')
                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      },
      revoke: () => {
        let content: string | VNodeChild = ``
        if (batchIds.length < 1) {
          content = (
            <div class="flex flex-col gap-y-1">
              <span class="text-[var(--color-text-1)]">
                确定要吊销该证书吗？吊销证书将影响绑定域名的HTTPS正常访问，请检查您的业务中是否仍在使用该域名，以免对您的业务造成影响。
              </span>
              <Form model={row} class="detail-form">
                <FormItem label="证书备注名">
                  {(row as LicenseItem).desc || '-'}
                </FormItem>
                <FormItem label="绑定域名">
                  <div class="flex flex-col items-center,gap-y-1">
                    {dealDomain(row as LicenseItem).map((item, index) => {
                      return <span key={`${item}_${index}`}>{item}</span>
                    })}
                  </div>
                </FormItem>
              </Form>
            </div>
          )
        } else {
          content = `确定要批量吊销选中的${batchIds.length}个证书吗？
        吊销证书将影响绑定域名的HTTPS正常访问，请检查您的业务中是否仍在使用该域名，以免对您的业务造成影响。`
        }
        const ids =
          batchIds.length > 0 ? batchIds : [(row as LicenseItem)?.id ?? '']

        VcModal.error(
          {
            title: '确认吊销证书',
            content: () => content
          },
          () => {
            loading.value = true
            return revokeLicenseApi({ id_list: ids })
              .then(() => {
                Message.success('已提交吊销申请')

                callback()
              })
              .finally(() => {
                loading.value = false
              })
          }
        )
      }
    }
    commandMap[command]()
  }

  return {
    detailDraw,
    handleCommand
  } as ColumnResult
}
