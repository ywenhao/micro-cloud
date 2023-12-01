import { defineStore } from 'pinia'

export const siteStore = defineStore({
  id: 'siteInfo',
  state: (): SiteStore => ({
    activeName: 'flow',
    activeIndex: 1,
    siteInfo: {} as SiteData,
    planType: 1,
    activeRuleType: 'url',
    activeNode: 'nodeConfig',
    htmlContent: '',
    defaultError: undefined,
    cacheData: {} as any
  }),
  actions: {
    // 更新选中项
    setActiveIndex(index: number) {
      this.activeIndex = index
    },
    //缓存后端返回的固定参数接口
    updateCacheData(value: any) {
      this.cacheData = { ...value }
    },
    // 更新选中项
    updateName(name: string) {
      this.siteInfo.domain = name
    },
    updateRuleType(type: any) {
      this.activeRuleType = type
    },
    /**节点选择板块缓存 */
    updateNodeType(type: any) {
      this.activeNode = type
    },
    /**缓存自定义页面的内容 */
    handleHtmlContent(value: string) {
      this.htmlContent = value
    },
    /**缓存默认错误信息页面 */
    handleDefaultErrorContent(value?: PageDefault) {
      console.log(value)
      this.defaultError = value
    },
    setSiteInfo(info: any) {
      this.siteInfo = { ...this.siteInfo, ...info }
    }
  },
  persist: true
})
