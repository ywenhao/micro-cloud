import type { TreeNodeData } from '@arco-design/web-vue'

import type { CommonReturnListItem } from '../../_utils'

export type DocModel = CommonReturnListItem<'/v1/document', 'get'>

export type DocModeDragParams = {
  /**
   * 产品UID
   * Format: int64
   * @example 16254646543251324
   */
  id: string
  /**
   * 排序序号
   * Format: int32
   * @example 1
   */
  index: number
  /**
   * 父类ID，如果是1级目录就传1,其他级就传该父级ID
   * Format: int64
   * @example 16254646543251324
   */
  parent_id: string
  /**
   * 产品ID {产品文档必传}
   * Format: int64
   */
  product_id?: string
}

export type DocTreeModel = DocModel &
  TreeNodeData & {
    type?: 'product' | 'doc'
    children?: DocModel
    isLeaf?: boolean
    file_type: 2 | 1
    level: number
  }
