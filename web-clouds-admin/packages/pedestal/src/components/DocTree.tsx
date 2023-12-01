import {
  Input as AInput,
  Message,
  Tree,
  type TreeInstance,
  TypographyText
} from '@arco-design/web-vue'
import {
  docInfoApi,
  type DocModeDragParams,
  type DocModel,
  type DocTreeModel,
  docUpdateApi
} from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
import { VcSvgIcon } from 'vc-material'
import { defineComponent } from 'vue'
import { withModifiers } from 'vue'

import NodeActions from './NodeActions.vue'

const resetData = (data: DocModel[]) => {
  data.forEach(item => {
    // @ts-ignore
    item.switcherIcon =
      item?.file_type === 2
        ? () => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" fill="white" fill-opacity="0.01" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14 1.33325H2V14.6666H14V1.33325ZM4.66671 4.66626H11.3334V5.99959H4.66671V4.66626ZM4.66671 7.33293H9.33337V8.66626H4.66671V7.33293Z"
                fill="#C9CDD4"
              />
            </svg>
          )
        : undefined

    // @ts-ignore
    if (item.file_type === 1 && !item.children?.length) {
      // item.switcherIcon = () => <i></i>
    }
    // @ts-ignore
    item.icon =
      item.file_type === 1
        ? () => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" fill="white" fill-opacity="0.01" />
              <path
                d="M1.33301 5.33358V2.00024H8.66634L9.46634 3.33358H14.6663V5.33358H1.33301Z"
                fill="#C9CDD4"
              />
              <path
                d="M1.33301 6.66659H14.6663V13.9999H1.33301V6.66659Z"
                fill="#C9CDD4"
              />
            </svg>
          )
        : undefined
    // @ts-ignore
    if (item?.children?.length) {
      // @ts-ignore
      resetData(item.children!)
    }
  })
  return data
}

export default defineComponent({
  name: 'DocTree',
  props: ['data', 'document_type', 'treeKey', 'currentNode'],
  emits: ['drag-submit', 'reload', 'update:currentNode'],
  setup(props, { emit, slots, expose }) {
    const renameData = ref<DocTreeModel>()
    const treeRef = ref<TreeInstance>()
    const resData = computed(() => resetData(props.data))
    const handleDragEnd: OnDrop = ({ dropNode, dragNode }) => {
      const data: DocModeDragParams = {
        index: dropNode.index!,
        id: dragNode.id!,
        parent_id:
          dropNode.file_type === 1 && dragNode.file_type === 2
            ? dropNode.id
            : dropNode.parent_id!,
        product_id: dragNode.product_id
      }
      emit('drag-submit', data)
    }

    const handleRename = (node: DocTreeModel) => {
      renameData.value = cloneDeep(node) as DocTreeModel
    }
    const handleRenameSubmit = async () => {
      const { title, id } = renameData.value as DocTreeModel
      docUpdateApi({ title: title!, id: id! } as any).then(async () => {
        if (props.currentNode?.id === id) {
          const info = await docInfoApi({ id: id! })
          emit('update:currentNode', info)
        }
        Message.success('修改成功')
        renameData.value = undefined
        emit('reload')
      })
    }
    expose({
      getTreeKey: props.treeKey,
      clearSelected() {
        treeRef.value?.selectAll(false)
      }
    })

    const getIsExpand = (node: DocTreeModel) => {
      if (node.file_type === 2 || node.isLeaf) return false
      const nodes = treeRef.value?.getExpandedNodes() || []
      const key = node.key as string
      return nodes.some(item => item && item.key === key)
    }

    // 展开/收起
    const handleExpand = (node: DocTreeModel) => {
      if (node.file_type === 2 || node.isLeaf) return
      const isExpand = getIsExpand(node)
      const key = node.key as string
      treeRef.value?.expandNode(key, !isExpand)
    }

    return () => (
      <Tree
        blockNode
        ref={treeRef}
        class="doc-tree"
        show-line={false}
        data={resData.value}
        onDrop={v => handleDragEnd(v as OnDropData)}
      >
        {{
          // // 文档节点icon
          // icon: ({ node }: { node: DocTreeModel }) =>
          //   node.file_type === 2 ? <VcSvgIcon name="doc" /> : null,
          title: (node: DocTreeModel) => {
            const titleNode =
              renameData.value?.id && node?.id === renameData.value.id ? (
                <>
                  <AInput
                    class="flex-1"
                    maxLength={20}
                    v-model={renameData.value.title}
                    // @ts-ignore
                    onClick={withModifiers(() => {}, ['stop'])}
                    onPressEnter={() => handleRenameSubmit()}
                  >
                    {{
                      suffix: () => <VcSvgIcon name="enter"></VcSvgIcon>
                    }}
                  </AInput>
                  <TypographyText
                    class="mb-0 ml-1"
                    // @ts-ignore
                    type="secondary"
                    onClick={withModifiers(
                      () => (renameData.value = undefined),
                      ['stop']
                    )}
                  >
                    取消
                  </TypographyText>
                </>
              ) : (
                <>
                  <span class="doc-title">{node.title}</span>
                  <NodeActions
                    v-model:currentNode={props.currentNode}
                    onRename={() => handleRename(node)}
                    document_type={
                      props.document_type ? props.document_type : 1
                    }
                    onReload={() => emit('reload')}
                    actions={
                      node.file_type === 1
                        ? node.level === 2
                          ? ['doc', 'rename', 'delete']
                          : ['sub', 'doc', 'rename', 'delete']
                        : ['rename', 'delete']
                    }
                    v-slots={slots}
                    nodeData={node}
                  ></NodeActions>
                </>
              )
            const LeftIcon = () => {
              if (node.file_type == 2)
                return <VcSvgIcon name="doc" class="mr-2px" />
              const isLeaf = node.isLeaf
              const isExpand = getIsExpand(node)
              const expandIconName = isLeaf
                ? 'expand-pack'
                : isExpand
                ? 'expand-minus'
                : 'expand-plus'

              return (
                <>
                  <VcSvgIcon
                    name={expandIconName}
                    class={['mr-2px', isLeaf && 'cursor-not-allowed']}
                  />
                  <VcSvgIcon name="dir" class="mr-2px" />
                </>
              )
            }
            return (
              <div
                class="node-title"
                onClick={() => handleExpand(node!)}
                style={{
                  '--level': node.level,
                  'padding-left': `${
                    16 + 16 * (node.level - (node.file_type === 1 ? 1 : 0))
                  }px`
                }}
              >
                {LeftIcon()}
                {titleNode}
              </div>
            )
          },
          // 线
          extra: (node: DocTreeModel) => {
            const count = node.file_type === 1 ? node.level - 1 : node.level
            const line = Array(count)
              .fill(0)
              .map((_, index) => (
                <span
                  class="left-line"
                  style={{
                    '--level': node.level,
                    '--left': `${24 + 16 * index}px`
                  }}
                />
              ))
            return <div class="node-extra">{line}</div>
          }
        }}
      </Tree>
    )
  }
})
