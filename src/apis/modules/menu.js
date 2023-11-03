/**
 * 菜单接口
 */
import request from '@/utils/request'
// 获取菜单列表
export const getMenuList = (params) => request.basic.get('/api/v1/menus', params)
// 获取菜单条数据
export const getMenu = (id) => request.basic.get(`/api/v1/menus/${id}`)
// 添加菜单
export const createMenu = (params) => request.basic.post('/api/v1/menus', params)
// 更新菜单
export const updateMenu = (id, params) => request.basic.put(`/api/v1/menus/${id}`, params)
// 删除菜单
export const delMenu = (id) => request.basic.delete(`/api/v1/menus/${id}`)
