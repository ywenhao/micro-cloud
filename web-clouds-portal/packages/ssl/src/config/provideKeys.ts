import type { UserInfoModel } from '@vcp/apis/pedestal'
// import type { Ref } from 'vue'
export type UserData = {
  adminInfo?: UserInfoModel
  token?: string
}
export const userDataKey = Symbol() as InjectionKey<UserData>
