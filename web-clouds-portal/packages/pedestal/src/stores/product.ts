import { type ProductInfoModel, queryProductListApi } from '@vcp/apis/pedestal'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
  const list = ref<ProductInfoModel[]>([])
  const loaded = ref(false)

  const getProductList = async () => {
    try {
      const res = await queryProductListApi({})
      list.value = res.list!
    } finally {
      loaded.value = true
    }
  }

  return { list, getProductList, loaded }
})
