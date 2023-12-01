import type { AdminModel } from '@vca/apis/src/pedestal/model/admin'
export type UserData = {
  adminInfo?: AdminModel
  token?: string
}
export const userDataKey = Symbol() as InjectionKey<UserData>
