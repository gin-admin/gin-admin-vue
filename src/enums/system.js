import Enum from 'xy-enum'
import i18n from '@/locales'
// 菜单类型
export const menuTypeEnum = new Enum([
    { key: 'page', value: 'page', desc: i18n.global.t('button.menu') },
    { key: 'button', value: 'button', desc: i18n.global.t('button.button') },
])
// 启用状态
export const statusTypeEnum = new Enum([
    { key: 'enabled', value: 'enabled', desc: i18n.global.t('pages.system.menu.form.status.enabled') },
    { key: 'disabled', value: 'disabled', desc: i18n.global.t('pages.system.menu.form.status.disabled') },
])

// 角色开启状态
export const statusUserTypeEnum = new Enum([
    { key: 'activated', value: 'activated', desc: i18n.global.t('pages.system.user.form.status.activated') },
    { key: 'freezed', value: 'freezed', desc: i18n.global.t('pages.system.user.form.status.freezed') },
])
