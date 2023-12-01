import type { CommonReturn } from '../../_utils'

export type ProductModel = CommonReturn<'/v1/product/info', 'get'> & {
  isLeaf?: boolean
}
