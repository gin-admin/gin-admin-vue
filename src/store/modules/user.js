import { defineStore } from 'pinia'
import { config } from '@/config'
import storage from '@/utils/storage'
import apis from '@/apis'

import useAppStore from './app'
import useMultiTab from './multiTab'
import useRouter from './router'

const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: storage.local.getItem(config('storage.userInfo'), null),
        token: storage.local.getItem(config('storage.token'), ''),
        permission: storage.local.getItem(config('storage.permission'), []),
    }),
    getters: {
        isLogin: (state) => !!state.token,
    },
    actions: {
        /**
         * 登录
         * @param {object} params
         * @returns {Promise<unknown>}
         */
        login(params) {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    try {
                        const result = await apis.user.login(params).catch(() => {
                            throw new Error()
                        })
                        const { success, data } = result || {}
                        if (config('http.code.success') === success) {
                            const { access_token } = data
                            this.token = access_token
                            storage.local.setItem(config('storage.token'), access_token)
                            await this.getUserInfo()
                        }
                        resolve(result)
                    } catch (error) {
                        reject()
                    }
                })()
            })
        },
        /**
         * 退出登录
         */
        logout() {
            return new Promise((resolve) => {
                const appStore = useAppStore()
                const multiTab = useMultiTab()
                const router = useRouter()
                storage.local.removeItem(config('storage.token'))
                storage.local.removeItem(config('storage.userInfo'))
                this.$reset()
                appStore.$reset()
                multiTab.$reset()
                router.$reset()
                resolve()
            })
        },
        /**
         * 获取用户详情
         */
        getUserInfo() {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    try {
                        const result = await apis.user.getUserDetail().catch(() => {
                            throw new Error()
                        })
                        const { success, data } = result || {}
                        if (config('http.code.success') === success) {
                            this.userInfo = data
                            storage.local.setItem(config('storage.userInfo'), this.userInfo)
                            resolve(result)
                        } else {
                            throw new Error()
                        }
                    } catch (error) {
                        reject()
                    }
                })()
            })
        },
    },
})

export default useUserStore
