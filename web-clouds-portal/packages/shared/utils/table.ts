import type { LabelValue } from 'vc-material'
import { VcTextEll } from 'vc-material'

export function renderOptions(options: LabelValue[]) {
  return options.map(({ label, value }) => {
    return {
      value,
      label,
      render: () => h(VcTextEll, { content: label })
    }
  })
}
