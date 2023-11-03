import request from '@/utils/request'

// 登录
export const login = (params) => request.basic.post('/api/v1/login', params)
// 获取用户详情
export const getUserDetail = () => request.basic.get('/api/v1/current/user')
// 更新用户信息
export const updateUser = (_, params) => request.basic.put(`/api/v1/current/user`, params)

// 更新用户密码
export const updatePassword = (_, params) => request.basic.put(`/api/v1/current/password`, params)
// 用户权限菜单
export const getUserMenu = () => request.basic.get('/api/v1/current/menus')
