/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-06-27 09:59:14
 * @LastEditors:
 * @LastEditTime: 2023-06-27 10:00:11
 */
import { request } from 'umi';

export async function addAuditRecord(params: any) {
  return request('/api/fan/addAudit', {
    method: 'post',
    data: params,
  });
}
