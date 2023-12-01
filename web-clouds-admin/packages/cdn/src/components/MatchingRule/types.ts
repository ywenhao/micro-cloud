import type { LabelValue } from 'vc-material'

export type FormValidator = (
  value: number | string | string[] | number[],
  callback: (err?: string) => void
) => void

// 运算符
export type Operator =
  | 'eq'
  | 'ne'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'
  | ''

export type MultipleOperatorType = 'in' | 'contains'

export type OperatorOption = { label: string; value: Operator } & {
  template: string
}

export type RuleValue = string | number

export interface IMatchingGroup {
  uuid: string
  rules: IMatchingRule[]
}

export interface IMatchingRule {
  uuid: string
  field: string
  operator: Operator
  value: RuleValue
}

export interface IField {
  type: 'input' | 'select' | 'switch'
  options?: LabelValue[] | (() => Promise<LabelValue[]>)
  placeholder?: string
  valueType?: 'boolean' | 'string' | 'number' | 'array'
  validator?: FormValidator | FormValidator[]
}

export interface IMatchConfig extends LabelValue {
  label: string
  value: string
  field: IField
  operatorOptions: OperatorOption[]
}
