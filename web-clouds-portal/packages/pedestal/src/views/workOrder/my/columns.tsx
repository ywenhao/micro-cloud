import { Image, Link, type TableColumnData, Tag } from '@arco-design/web-vue'
import type { WorkerOrderModel } from '@vcp/apis/pedestal'
import { mergeBaseURL } from '@vcp/shared'
import {
  checkImages,
  emptyFormatterUnix,
  emptyText,
  sortableSettings,
  VcSvgIcon
} from 'vc-material'
import { withModifiers } from 'vue'

import type { PreviewState } from './MyAllItem.vue'

export function useColumns({
  previewState,
  handleEnd,
  goTalkPage
}: {
  previewState: PreviewState
  handleEnd: (rows: WorkerOrderModel[]) => Promise<void>
  goTalkPage: (row: WorkerOrderModel) => void
}) {
  const imageRowList = reactive<string[]>([])

  const handlePreview = (pictures: string[]) => {
    previewState.srcList = pictures.slice()
    previewState.visible = true
  }

  const columns: TableColumnData[] = [
    {
      dataIndex: 'title',
      title: '标题',
      ellipsis: true,
      tooltip: true,
      width: 240,
      render: ({ record }) => (
        <span
          class="td-link"
          onClick={() => goTalkPage(record as WorkerOrderModel)}
        >
          {emptyText(record.title)}
        </span>
      )
    },
    {
      dataIndex: 'type_name',
      title: '所属产品/类型',
      ellipsis: true,
      tooltip: true,
      render: ({ record }) =>
        emptyText(`${record.product_name} | ${record.type_name}`)
    },
    {
      dataIndex: 'picture_path',
      title: '附件图片',
      render: ({ record, rowIndex }) => {
        if (!record.picture_path) return '-'
        let pictures = record.picture_path.split(',') as string[]

        if (pictures.length) {
          pictures = pictures.map(picture => mergeBaseURL(picture))
          checkImages(pictures).then(res => {
            res.length && (imageRowList[rowIndex] = res[0].url)
          })
        }

        return (
          <div
            class="table-image"
            onClick={withModifiers(() => handlePreview(pictures), ['stop'])}
          >
            <Image preview={false} src={imageRowList[rowIndex]}>
              {{
                extra:
                  pictures.length > 1
                    ? () => <div class="image-count">{pictures.length}</div>
                    : void 0,
                error: !imageRowList[rowIndex]
                  ? () => <VcSvgIcon class="w-full h-full" name="image_error" />
                  : void 0
              }}
            </Image>
          </div>
        )
      }
    },
    {
      dataIndex: 'create_time',
      title: '反馈时间',
      render: emptyFormatterUnix,
      sortable: sortableSettings
    },
    {
      dataIndex: 'state',
      title: '工单状态',
      render({ record }) {
        const className = record.state === 1 ? 'is-success' : 'is-info'
        const tag = record.state === 1 ? '处理中' : '已结单'
        const hasNewReply = record.user_has_new_reply === 1
        return (
          <div class="relative w-min my-9px">
            <Tag class={className}>{tag}</Tag>
            {hasNewReply && (
              <span class="absolute right--35px top--10px custom-badge">
                新回复
              </span>
            )}
          </div>
        )
      }
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: 110,
      render: ({ record }) => [
        <Link
          disabled={record.state === 2}
          onClick={withModifiers(
            () => handleEnd([record as WorkerOrderModel]),
            ['stop']
          )}
        >
          结单
        </Link>,
        <Link onClick={() => goTalkPage(record as WorkerOrderModel)}>详情</Link>
      ]
    }
  ]
  return columns
}
