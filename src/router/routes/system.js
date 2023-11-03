import { SettingOutlined, SmileOutlined } from '@ant-design/icons-vue'

export default [
    {
        path: 'logger',
        name: 'logger',
        component: '/logger/index.vue',
        meta: {
            icon: SmileOutlined,
            title: '日志管理',
            isMenu: true,
            keepAlive: true,
            permission: '*',
        },
    },
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
                component: '/system/user/index.vue',
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
                component: '/system/role/index.vue',
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
                component: '/system/menu/index.vue',
                meta: {
                    title: '菜单管理',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
            {
                path: 'new-menu',
                name: 'systemNewMenu',
                component: '/system/new-menu/index.vue',
                meta: {
                    title: '新版菜单管理',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
            {
                path: 'dict',
                name: 'systemDict',
                component: '/system/dict/index.vue',
                meta: {
                    title: '字典管理',
                    isMenu: true,
                    keepAlive: true,
                    permission: '*',
                },
            },
        ],
    },
]
