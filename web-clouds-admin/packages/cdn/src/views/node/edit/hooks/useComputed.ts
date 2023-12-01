import type { TableColumnData } from '@arco-design/web-vue'
import type { NodeEditModal } from '@vca/apis/cdn'

export const useComputed = (formState?: NodeEditModal) => {
  const columns = computed(() => (mode?: 'public' | 'private') => {
    const res: TableColumnData[] = [
      {
        title: '网卡名称',
        cellStyle: { 'vertical-align': 'top' },
        dataIndex: 'name',
        width: 340,
        slotName: 'name'
      },
      {
        title: '节点IP',
        cellStyle: { 'vertical-align': 'top' },
        dataIndex: 'ip',
        slotName: 'ip'
      },
      {
        cellStyle: { 'vertical-align': 'top' },
        dataIndex: 'actions',
        title: '操作',
        width: mode === 'private' ? 80 : 146,
        slotName: 'actions',
        cellClass: 'table-actions'
      }
    ]
    return res
  })
  /**
   * 内网 IP 删除按钮 禁用状态
   *```
   * - 如果没有公网 IP，内网第一条不允许删除 下面两条用于判断是否有公网 IP
   *
   * - 判断公网 IP 是否存在
   *   1. 公网 name 和 IP 不允许为空
   *   2. 公网 IP 必须是公网 IP (是一个IPV4 地址，且不是私有 IP)
   *   2. 当前主IP不是传入的IP
   * ```
   */
  const privateRemoveDisabled = (recordIp: string, index: number) => {
    if (!formState) return false
    const mainLength =
      formState.used_public_ips?.filter(item => {
        // 公网 name 和 IP 不允许为空
        const notNull = item.name && item.ip
        // 公网 IP 必须是公网 IP (是一个IPV4 地址，且不是私有 IP)
        const isPublicIp =
          regexpMap.ipv4.test(item.ip!) && !regexpMap.privateIP.test(item.ip!)
        return notNull && isPublicIp
      })?.length || 0
    // 当前主IP 不为空且，在 公网 IP 列表中
    const isCurrent = formState.main_ip_val === recordIp
    console.log({ mainLength, index, isCurrent })
    return (mainLength === 0 && index === 0) || isCurrent
  }
  return { columns, privateRemoveDisabled }
}
