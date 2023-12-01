type TabPaneName = string | number

interface IAttach {
  rate_limit?: string
  region_id: string
  region_name: string
}

interface ObjectClass {
  label: string
  value: string
}

interface CacheData {
  continentList: ObjectClass[]
  countriesList: ObjectClass[]
  httpsVersionList: string[]
  requestList: string[]
}

interface SiteData {
  id: string
  domain: string
  user_id: string
  user_name: string
  attach: IAttach
  cname_domain: string
  cert_status: number
  status: number
  origin_site_num: number
  updated_at: string
  created_at: string
}

interface PageDefault {
  always_online: string
  captcha_challenge: string
  err_1000: string
  err_code_500: string
  err_from_origin: number
  managed_challenge: string
  rate_limiting: string
  reject_since_ip_location: string
  reject_waf: string
}

interface SiteStore {
  activeName: string
  activeIndex: number
  siteInfo: SiteData
  planType: number
  activeRuleType: TabPaneName
  activeNode: TabPaneName
  htmlContent: string
  defaultError?: PageDefault
  cacheData: CacheData
}
