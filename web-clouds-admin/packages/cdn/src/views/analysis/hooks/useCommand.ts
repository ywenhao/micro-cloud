import { Message } from '@arco-design/web-vue'
import {
  deleteCdnResolvRegionsByIdApi,
  deleteCdnResolvSiteResolvesByIdApi
} from '@vca/apis/cdn'
import { cloneDeep } from 'lodash-es'
import { VcModal } from 'vc-material'
import type { Ref } from 'vue'

import type AnalysisTable from '../AnalysisTable.vue'

export type AnalysisTableInstance = InstanceType<typeof AnalysisTable>
export type ICommand =
  | 'CREATE'
  | 'DEL'
  | 'EDIT'
  | 'SEARCH'
  | 'SITE_COUNT'
  | 'NODE_COUNT'
export type UseCommandOptions = {
  // Table Instance
  tableRef?: Ref<AnalysisTableInstance | undefined>
  module: 'domain' | 'region'
  deleteAfter?: () => void
}

/** 事件处理集合 */
export function useCommand(options: UseCommandOptions) {
  const editorState = reactive<CommonState>({
    visible: false,
    record: undefined
  })
  const detailState = reactive<
    CommonState<string> & {
      type: 'site' | 'node'
    }
  >({
    type: 'site',
    visible: false,
    record: undefined
  })
  // const router = useRouter()
  /** 事件处理集合 */
  const commandEvent = (command: ICommand, record?: any) => {
    const actions: Record<ICommand, () => void> = {
      SITE_COUNT: () => {
        detailState.record = record?.id
        detailState.type = 'site'
        detailState.visible = true
        console.log(detailState)
      },
      NODE_COUNT: () => {
        detailState.record = record?.id
        detailState.type = 'node'
        detailState.visible = true
        console.log(detailState)
      },
      SEARCH: () => {
        if (options?.tableRef?.value?.refresh) {
          options?.tableRef?.value?.refresh()
        }
      },
      CREATE: () => {
        editorState.record = undefined
        editorState.visible = true
      },
      EDIT: () => {
        editorState.record = cloneDeep(record)
        editorState.visible = true
      },
      DEL: () => {
        const action =
          options.module === 'domain'
            ? deleteCdnResolvSiteResolvesByIdApi
            : deleteCdnResolvRegionsByIdApi
        const request = () =>
          action({ id: record!.id! }).then(() => {
            Message.success('删除成功')
            options?.deleteAfter && options?.deleteAfter()
            if (options?.tableRef?.value?.refresh) {
              options?.tableRef?.value?.refresh()
            }
          })
        VcModal.error(
          {
            title:
              options.module === 'domain'
                ? '移除所选域名解析'
                : '移除所选解析区域',
            content: `删除该${
              options.module === 'domain' ? '域名解析' : '解析区域'
            }后，将不可恢复。`
          },
          request
        )
      }
    }
    actions[command]()
  }

  return { editorState, detailState, commandEvent }
}
