import { type CommonAPI, defHttp } from '..'

/**记录列表 */
export const recordListApi: CommonAPI<'/v1/dns/rrs', 'get'> = params =>
  defHttp.get('v1/dns/rrs', { params })

/**添加记录 */
export const addRecordApi: CommonAPI<'/v1/dns/rr', 'post'> = data =>
  defHttp.post('v1/dns/rr', { data })

/**更新记录 */
export const updateRecordApi: CommonAPI<'/v1/dns/rr', 'put'> = data =>
  defHttp.put(`v1/dns/rr`, { data })

/**删除记录 */
export const delRecordApi: CommonAPI<'/v1/dns/rr', 'delete'> = data =>
  defHttp.delete(`v1/dns/rr`, { data })

/**批量添加记录 */
export const addBatchRecordApi: CommonAPI<'/v1/dns/rrs/batch', 'post'> = data =>
  defHttp.post('v1/dns/rrs/batch', { data })

/**批量添加记录2 */
export const addBatchRecord2Api: CommonAPI<
  '/v1/dns/rrs/batch_line',
  'post'
> = data => defHttp.post('v1/dns/rrs/batch_line', { data })

/**批量更新记录 */
export const updateBatchRecordApi: CommonAPI<
  '/v1/dns/rrs/batch',
  'put'
> = data => defHttp.put(`v1/dns/rrs/batch`, { data })

/**批量删除记录 */
export const deleteBatchRecordApi: CommonAPI<
  '/v1/dns/rrs/batch',
  'delete'
> = data => defHttp.delete(`v1/dns/rrs/batch`, { data })

/**获取DNS记录信息 */
export const recordInfoApi: CommonAPI<'/v1/dns/rr', 'get'> = params =>
  defHttp.get('v1/dns/rr', { params })
