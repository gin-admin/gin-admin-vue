/**
 *  权限接口
 */
import request from '@/utils/request'
// 获取role列表
export const getRoleList = (params) => request.basic.get('/api/v1/roles', params)
// 获取role条数据
export const getRole = (id) => request.basic.get(`/api/v1/roles/${id}`)
// 添加role
export const createRole = (params) => request.basic.post('/api/v1/roles', params)
// 更新role
export const updateRole = (id, params) => request.basic.put(`/api/v1/roles/${id}`, params)
// 删除role
export const delRole = (id) => request.basic.delete(`/api/v1/roles/${id}`)
