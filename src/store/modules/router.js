import { defineStore } from 'pinia'

import router from '@/router'
import { notFoundRoute } from '@/router/config'
import { filterRoutes, formatRoutes, generateMenuList, generateRoutes, getFirstValidRoute } from '@/router/util'
import { findTree } from '@/utils/util'
import { config } from '@/config'
import apis from '@/apis'
import { formatApiData } from '../../router/util'

function getUserPermission(data) {
    const result = []

    data.forEach((item) => {
        if (item.type === 'page') {
            result.push({
                permission: item.code,
                actions: item?.actions || '*',
            })
            if (item.children && item.children.length) {
                const temp = getUserPermission(item.children)
                result.push(...(temp || []))
            }
        }
    })

    return result
}

const useRouterStore = defineStore('router', {
    state: () => ({
        routes: [],
        menuList: [],
        indexRoute: null,
    }),
    getters: {},
    actions: {
        /**
         * 获取路由列表
         * @returns {Promise}
         */
        getRouterList() {
            return new Promise((resolve) => {
                ;(async () => {
                    const { data } = await apis.user.getUserMenu()
                    const list = formatApiData(data)
                    const tt = formatRoutes(list)
                    const userPermission = getUserPermission(list)
                    const validRoutes = config('app.permission') ? filterRoutes(tt, userPermission) : formatRoutes(tt)
                    const menuList = generateMenuList(validRoutes)

                    const routes = [...generateRoutes(validRoutes), notFoundRoute]
                    const indexRoute = getFirstValidRoute(menuList)

                    routes.forEach((route) => {
                        router.addRoute(route)
                    })
                    this.routes = routes
                    this.menuList = menuList
                    this.indexRoute = indexRoute
                    resolve()
                })()
            })
        },
        /**
         * 设置徽标
         * @param {string} name 名称
         * @param {number} count 数量
         */
        setBadge({ name, count } = {}) {
            let menuInfo = null
            findTree(
                this.menuList,
                name,
                (item) => {
                    menuInfo = item
                },
                { key: 'name', children: 'children' }
            )
            if (menuInfo) {
                menuInfo.meta.badge = count
            }
        },
    },
})

export default useRouterStore
