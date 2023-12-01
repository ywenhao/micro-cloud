import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/**
 * @description: 统计
 */

/** 统计节点任务 */
export const getCollectNodeApi: CommonAPI<'/v1/collect/node', 'get'> = params =>
  defHttp.get(`/v1/collect/node`, { params })

/** 概览用量统计(转码或截图)（返回值不是百分比） */
export const getMtsCollectDosageApi: CommonAPI<
  '/v1/mts/collect/dosage',
  'get'
> = params => defHttp.get(`/v1/mts/collect/dosage`, { params })

/** 任务处理统计（转码时长、截图次数、 用户排行榜）（返回值不是百分比） */
export const getMtsCollectDurationApi: CommonAPI<
  '/v1/mts/collect/duration',
  'get'
> = params => defHttp.get(`/v1/mts/collect/duration`, { params })

/** 任务状态统计（概览-各个任务的状态统计）（返回值不是百分比） */
export const getMtsCollectStatusApi: CommonAPI<
  '/v1/mts/collect/status',
  'get'
> = params => defHttp.get(`/v1/mts/collect/status`, { params })

/** 任务处理统计(任务时长占比、任务完成情况、任务数排名)（返回值不是百分比） */
export const getMtsCollectTaskApi: CommonAPI<
  '/v1/mts/collect/task',
  'get'
> = params => defHttp.get(`/v1/mts/collect/task`, { params })

/** 统计用户（转码用户数、执行用户数） */
export const getMtsCollectUserApi: CommonAPI<
  '/v1/mts/collect/user',
  'get'
> = params => defHttp.get(`/v1/mts/collect/user`, { params })
