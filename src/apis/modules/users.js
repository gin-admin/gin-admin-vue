/**
 * 管理员角色
 */

import request from '@/utils/request'
// 获取管理员列表
export const getUsersList = (params) => request.basic.get('/api/v1/users', params)
// 获取管理员条数据
export const getUsers = (id) => request.basic.get(`/api/v1/users/${id}`)
// 添加管理员
export const createUsers = (params) => request.basic.post('/api/v1/users', params)
// 更新管理员
export const updateUsers = (id, params) => request.basic.put(`/api/v1/users/${id}`, params)
// 删除管理员
export const delUsers = (id) => request.basic.delete(`/api/v1/users/${id}`)
