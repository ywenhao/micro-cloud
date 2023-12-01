import type { CommonReturn } from '../../_utils'

export type AlarmConfigResp = CommonReturn<'/v1/alarm_config', 'get'>
export type AlarmConfig = AlarmConfigResp['alarm_config'] & {}
export type AlarmConfigTG = AlarmConfig['telegram_config'] & {
  id: string
}
export type AlarmConfigEmail = AlarmConfig['email_config'] & {
  email: string
}
export type AlarmConfigNotification = AlarmConfig['notification']

export type AlarmConfigFormState = {
  telegram_config: AlarmConfigTG
  email_config: AlarmConfigEmail
  notification: AlarmConfigNotification
}
