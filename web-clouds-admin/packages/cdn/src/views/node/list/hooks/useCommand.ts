import { Message } from '@arco-design/web-vue'
import {
  addCdnnodeNodesResolveApi,
  deleteCdnnodeNodesByIdApi,
  deleteCdnnodeNodesResolveApi,
  postCdnnodeNodesClearCacheBatchApi,
  postCdnnodeNodesForceSyncBatchApi,
  postCdnnodeNodesStartStopBatchApi
} from '@vca/apis/cdn'
import { has } from 'lodash-es'
import { VcModal } from 'vc-material'

/** EDIT: 编辑 CONFIG: 配置, VERSION_UPGRADE: 版本升级, SYNC_CONFIG: 同步配置, ERROR_LOG: 错误日志, CLEAR_CACHE: 清除缓存, DELETE: 删除 */
export type ICommand =
  | 'EDIT'
  | 'CONFIG'
  | 'VERSION_UPGRADE'
  | 'SYNC_CONFIG'
  | 'ERROR_LOG'
  | 'CLEAR_CACHE'
  | 'DELETE'
  | 'START'
  | 'STOP'
  | 'RESTART'
  | 'RESOLVE_ADD'
  | 'RESOLVE_RM'

export type UseCommandOptions = {
  selectedKeys: () => string[]
  deleteAfter: () => void
  // 刷新
  refresh: () => void
}
export function useCommand(options: UseCommandOptions) {
  const currentNodeId = ref('')
  const risibles = reactive<Record<string, boolean>>({
    version: false,
    errorLog: false,
    editor: false
  })
  const router = useRouter()

  const handleReStart = (
    params: {
      node_ids: string[]
      // 1: 启动 2: 停止 3: 复位/重启
      op: 1 | 2 | 3
    },
    refresh: () => void
  ) => {
    const messageMap = {
      '1': '启用成功',
      '2': '停止成功',
      '3': '重启成功'
    }
    return new Promise<void>((resolve, reject) => {
      postCdnnodeNodesStartStopBatchApi(params as any)
        .then(() => {
          Message.success(messageMap[params.op])
          refresh()
          resolve()
        })
        .catch(() => reject())
    })
  }
  /** 事件处理集合 */
  const commandEvent = (command: ICommand, record?: any) => {
    const actions: Record<ICommand, () => void> = {
      RESOLVE_ADD() {
        addCdnnodeNodesResolveApi({ node_id: record.id }).then(() => {
          Message.success('添加成功')
          options.refresh()
        })
      },
      RESOLVE_RM() {
        const request = () =>
          deleteCdnnodeNodesResolveApi({ node_id: record.id })
        VcModal.confirm(
          { title: '确认移除解析', content: '确定要移除该节点的解析吗？' },
          request
        )
      },
      START() {
        handleReStart({ node_ids: [record.id], op: 1 }, options.refresh)
      },
      STOP() {
        const request = () =>
          handleReStart({ node_ids: [record.id], op: 2 }, options.refresh)
        VcModal.confirm(
          { title: '确认停用节点', content: '确定要停用该节点吗？' },
          request
        )
      },
      RESTART() {
        const request = () =>
          handleReStart({ node_ids: [record.id], op: 3 }, options.refresh)
        VcModal.confirm(
          { title: '确认重启节点', content: '确定要重启该节点吗？' },
          request
        )
      },
      EDIT() {
        router.push({ name: 'NodeEdit', params: { id: record.id } })
      },
      CONFIG() {
        router.push({ name: 'NodeSetup', params: { id: record.id } })
      },
      VERSION_UPGRADE() {
        currentNodeId.value = record?.id
        risibles.version = true
      },
      SYNC_CONFIG() {
        const keys = record?.id ? [record.id] : options.selectedKeys()
        const request = () =>
          postCdnnodeNodesForceSyncBatchApi({ node_ids: keys }).then(() => {
            Message.success('操作成功')
            // options?.deleteAfter && options.deleteAfter()
            options.refresh()
          })
        VcModal.confirm(
          { title: '同步配置', content: '确认同步节点信息？' },
          request
        )
      },
      ERROR_LOG() {
        risibles.errorLog = true
      },
      CLEAR_CACHE() {
        const keys = record?.id ? [record.id] : options.selectedKeys()
        const request = () =>
          postCdnnodeNodesClearCacheBatchApi({ node_ids: keys }).then(() => {
            Message.success('操作成功')
            // options?.deleteAfter && options.deleteAfter()
            options.refresh()
          })
        VcModal.confirm(
          { title: '清除缓存', content: '确认清除缓存？' },
          request
        )
      },
      DELETE() {
        const request = () =>
          deleteCdnnodeNodesByIdApi({ node_id: record!.id! }).then(() => {
            Message.success('删除成功')
            options?.deleteAfter && options.deleteAfter()
            options?.refresh && options.refresh()
          })
        VcModal.error(
          {
            title: '删除节点',
            content: '确认删除所选节点？'
          },
          request
        )
      }
    }
    has(actions, command) && actions[command]()
  }

  return { risibles, commandEvent, currentNodeId }
}
