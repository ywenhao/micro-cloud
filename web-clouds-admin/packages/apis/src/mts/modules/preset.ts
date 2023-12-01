import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/**
 * @description: 预设管理
 */

/** 预设列表 */
export const getMtsPresetListApi: CommonAPI<'/v1/mts/preset', 'get'> = params =>
  defHttp.get(`/v1/mts/preset`, { params })

/** 删除预设 */
export const deleteMtsPresetApi: CommonAPI<
  '/v1/mts/preset',
  'delete'
> = params => defHttp.delete(`/v1/mts/preset`, { params })

/** 预设详情 */
export const getMtsPresetInfoDetailApi: CommonAPI<
  '/v1/mts/preset/info',
  'get'
> = params => defHttp.get(`/v1/mts/preset/info`, { params })

/** 创建视频预设 */
export const addMtsPresetVideoApi: CommonAPI<
  '/v1/mts/preset/video',
  'post'
> = data => defHttp.post(`/v1/mts/preset/video`, { data })

/** 修改视频预设 */
export const updateMtsPresetVideoApi: CommonAPI<
  '/v1/mts/preset/video',
  'put'
> = data => defHttp.put(`/v1/mts/preset/video`, { data })

/** 获取字体 */
export const getMtsPresetFontApi: CommonAPI<
  '/v1/mts/preset/font',
  'get'
> = params => defHttp.get(`/v1/mts/preset/font`, { params })

/** 获取水印预览图片 */
export const getMtsPresetPreviewApi: CommonAPI<
  '/v1/mts/preset/preview',
  'get'
> = params => defHttp.get(`/v1/mts/preset/preview`, { params })
