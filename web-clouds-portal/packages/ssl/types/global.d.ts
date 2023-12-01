// import type {
//   EventCenterForMicroApp,
//   pureCreateElement,
//   removeDomScope
// } from '@micro-zoe/micro-app'

export {}

declare global {
  interface Window {
    // microApp: EventCenterForMicroApp & {
    //   removeDomScope: typeof removeDomScope
    //   pureCreateElement: typeof pureCreateElement
    // }
    // eventCenterForAppNameVite: any
    // __MICRO_APP_NAME__: string
    // __MICRO_APP_ENVIRONMENT__: string
    // __MICRO_APP_BASE_APPLICATION__: string
  }
}

declare interface CommonState<T = any> {
  visible: boolean
  record: T | undefined
  loading?: boolean
}
