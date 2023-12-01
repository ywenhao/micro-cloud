import type { CommonReturn } from '../../_utils'

export type ConfModel = CommonReturn<'/v1/conf', 'get'>

export type UploadFile = CommonReturn<'/v1/upload', 'get'>
