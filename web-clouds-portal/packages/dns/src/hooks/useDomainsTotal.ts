import { getSource } from 'vc-material'
import { getTrimValue } from 'vc-material/utils'

export function useDomainsTotal(domains: RefSource<string>) {
  const item = getSource(domains)
  const total = computed(() =>
    item.value ? getTrimValue(item.value).length : 0
  )
  return total
}
