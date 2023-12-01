import type { DescData } from '@arco-design/web-vue'
import type { ProductModel } from '@vca/apis/pedestal'

export interface CardInfo {
  name: string
  icon: ProductModel
  content: DescData[]
  portal: string
}
