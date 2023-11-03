import Enum from 'xy-enum'

// 菜单类型
export const menuTypeEnum = new Enum([
    { key: 'page', value: 'page', desc: '菜单' },
    { key: 'button', value: 'button', desc: '按钮' },
])
// 启用状态
export const statusTypeEnum = new Enum([
    { key: 'enabled', value: 'enabled', desc: '启用' },
    { key: 'disabled', value: 'disabled', desc: '禁用' },
])
// 角色开启状态
export const statusUserTypeEnum = new Enum([
    { key: 'activated', value: 'activated', desc: '启用' },
    { key: 'freezed', value: 'freezed', desc: '禁用' },
])
