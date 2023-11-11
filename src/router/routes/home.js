import { SmileOutlined } from '@ant-design/icons-vue'

export default [
    {
        path: 'home',
        name: 'home',
        component: 'home/index.vue',
        meta: {
            icon: SmileOutlined,
            title: '欢迎页',
            isMenu: true,
            keepAlive: true,
            permission: '*',
        },
    },
]
