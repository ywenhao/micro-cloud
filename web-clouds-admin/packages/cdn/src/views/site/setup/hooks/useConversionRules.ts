import { Message } from '@arco-design/web-vue'
import {
  type ConversionRuleItem,
  deleteCdnSiteTransformRuleByIdApi,
  updateCdnSiteTransformRuleByIdApi
} from '@vca/apis/cdn'
import { VcModal } from 'vc-material'
export default function useConversionRules(
  rule_type: number,
  getList: () => void
) {
  const route = useRoute()
  const siteId = route.params.id as string
  const ruleState = reactive<any>({
    visible: false,
    id: '',
    rule_type: rule_type
  })

  type ICommand = 'EDIT' | 'DELETE' | 'STATUS' | 'CREATE'

  /** 事件处理集合 */
  const commandEvent = (command: ICommand, record?: ConversionRuleItem) => {
    const actions: Record<ICommand, () => void> = {
      CREATE() {
        ruleState.visible = true
        ruleState.id = undefined
      },
      EDIT() {
        ruleState.id = record?.rule_id ?? ''
        ruleState.visible = true
      },
      STATUS() {
        const status = Number(record?.status) === 1 ? 2 : 1
        const data = {
          rule_id: record?.rule_id ?? '',
          site_id: siteId,
          rule_type: rule_type,
          rule: { ...record, status: status }
        }
        updateCdnSiteTransformRuleByIdApi(data).then(() => {
          Message.success(status === 1 ? '开启成功' : '关闭成功')
          getList()
        })
      },
      DELETE() {
        const request = () =>
          deleteCdnSiteTransformRuleByIdApi({
            rule_id: record?.rule_id ?? '',
            site_id: siteId
          }).then(() => {
            Message.success('删除成功')
            getList()
          })
        VcModal.error(
          {
            title: '删除规则',
            content: '确认删除所选规则？'
          },
          request
        )
      }
    }
    actions[command]()
  }

  return {
    ruleState,
    commandEvent
  }
}
