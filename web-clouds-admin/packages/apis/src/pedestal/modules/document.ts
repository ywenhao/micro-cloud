import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/** 查询所有文本文档(新手指南使用) */
export const docAllApi: CommonAPI<'/v1/document/all', 'get'> = params =>
  defHttp.get('/v1/document/all', { params })

/** 查询文档 */
export const docDirApi: CommonAPI<'/v1/document', 'get'> = params =>
  defHttp.get('/v1/document', { params })

/** 创建文档 */
export const docCreateApi: CommonAPI<'/v1/document', 'post'> = data =>
  defHttp.post('/v1/document', { data })

/** 修改文档排序 */
export const docIndexApi: CommonAPI<'/v1/document/index', 'put'> = data =>
  defHttp.put('/v1/document/index', { data })

/** 修改文档 */
export const docUpdateApi: CommonAPI<'/v1/document', 'put'> = data =>
  defHttp.put('/v1/document', { data })

/** 删除文档 */
export const docDelApi: CommonAPI<'/v1/document', 'delete'> = params =>
  defHttp.delete('/v1/document', { params }, { joinParamsToUrl: true })

/** 文档详情 */
export const docInfoApi: CommonAPI<'/v1/document/info', 'get'> = params =>
  defHttp.get('/v1/document/info', { params }, { joinParamsToUrl: true })
