import { SettingOutlined } from '@ant-design/icons-vue'

export default [
    {
        path: 'system',
        name: 'system',
        component: 'RouteViewLayout',
        meta: {
            icon: SettingOutlined,
            title: '系统管理',
            isMenu: true,
            keepAlive: true,
            permission: '*',
        },
        children: [
            {
                path: 'user',
                name: 'user',
                component: 'system/user/index.vue',
                meta: {
                    title: '成员与部门',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
            {
                path: 'role',
                name: 'role',
                component: 'system/role/index.vue',
                meta: {
                    title: '角色管理',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
            {
                path: 'menu',
                name: 'menu',
                component: 'system/menu/index.vue',
                meta: {
                    title: '菜单管理',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
            {
                path: 'logger',
                name: 'logger',
                component: 'system/logger/index.vue',
                meta: {
                    title: '日志管理',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
        ],
    },
]
