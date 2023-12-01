import { type CommonAPI, defHttp } from '..'

/**
 * @description: 统计
 */

/** 概览用量 */
export const getMtsCollectDosageApi: CommonAPI<
  '/v1/mts/collect/dosage',
  'get'
> = params => defHttp.get(`/v1/mts/collect/dosage`, { params })
