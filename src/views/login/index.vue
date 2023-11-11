<template>
    <div>
        <a-tabs>
            <!-- 账号登录 -->
            <a-tab-pane
                key="account"
                :tab="$t('pages.login.accountLogin.tab')">
                <a-form
                    :model="formData"
                    :rules="formRules"
                    ref="formRef">
                    <a-form-item name="username">
                        <a-input
                            :placeholder="$t('pages.login.username.placeholder')"
                            v-model:value="formData.username"
                            size="large">
                            <template #prefix>
                                <user-outlined></user-outlined>
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password">
                        <a-input
                            v-model:value="formData.password"
                            size="large"
                            type="password"
                            :placeholder="$t('pages.login.password.placeholder')"
                            @pressEnter="handleLogin">
                            <template #prefix>
                                <lock-outlined></lock-outlined>
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="captcha_code">
                        <a-space>
                            <a-input
                                v-model:value="formData.captcha_code"
                                size="large"
                                type="text"
                                :placeholder="$t('pages.login.captcha.placeholder')"
                                @pressEnter="handleLogin">
                                <template #prefix>
                                    <safety-outlined />
                                </template>
                            </a-input>
                            <a-image
                                @click="getCaptcha"
                                :preview="false"
                                :width="140"
                                :height="42"
                                :src="captcha_img" />
                        </a-space>
                    </a-form-item>
                    <a-form-item>
                        <a-button
                            type="primary"
                            size="large"
                            block
                            :loading="loading"
                            @click="handleLogin"
                            >{{ $t('pages.login.submit') }}
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { Modal, notification } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LockOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { config } from '@/config'
import { useForm } from '@/hooks'
import { useAppStore, useRouterStore, useUserStore } from '@/store'
import { timeFix } from '@/utils/util'
import apis from '@/apis'
import { md5 } from 'js-md5'
import { useI18n } from 'vue-i18n'
defineOptions({
    name: 'login',
})
const { t } = useI18n() // 解构出t方法
const { formData, formRef, formRules } = useForm()
const appStore = useAppStore()
const userStore = useUserStore()
const routerStore = useRouterStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const captcha_img = ref('')
const captcha_id = ref('')
const httpApi = import.meta.env.BASE_URL + `api/v1/captcha/image`
const redirect = computed(() => decodeURIComponent(route.query?.redirect ?? ''))

formRules.value = {
    username: { required: true, message: t('pages.login.username.placeholder') },
    password: { required: true, message: t('pages.login.password.placeholder') },
    captcha_code: { required: true, message: t('pages.login.captcha.placeholder') },
}

onMounted(() => {
    // 清理登录信息
    userStore.logout()
    getCaptcha()
})

/**
 * 获取 验证码ID
 */
async function getCaptcha() {
    const { data } = await apis.common.getCaptcha().catch((err) => {
        console.log(err)
    })
    captcha_id.value = data.captcha_id
    captcha_img.value = httpApi + `?id=${data.captcha_id}`
}
/**
 * 登录
 * @return {Promise<void>}
 */
async function handleLogin() {
    formRef.value.validate().then(async (values) => {
        values.captcha_id = captcha_id.value
        if (values.password === 'abc-123') values.password = md5(values.password)

        loading.value = true
        const { success } = await userStore
            .login({
                ...values,
            })
            .catch(() => {
                loading.value = false
                getCaptcha()
            })
        loading.value = false
        if (config('http.code.success') === success) {
            // 加载完成
            if (appStore.complete) {
                goIndex()
            } else {
                await appStore.init()
                goIndex()
            }
        }
    })
}

/**
 * 获取首页路由
 * @return {*}
 */
function getFirstValidRoute() {
    const indexRoute = routerStore.indexRoute
    if (!indexRoute) {
        Modal.warning({
            title: '系统提示',
            content: '没有任何权限，请联系系统管理员',
            onOk: () => {
                window.location.reload()
            },
        })
    }
    return indexRoute
}

/**
 * 去首页
 */
function goIndex() {
    if (redirect.value) {
        location.href = redirect.value
    } else {
        const indexRoute = getFirstValidRoute()
        if (!indexRoute) return
        router.push(indexRoute)
    }
    notification.success({
        message: t('welcome'),
        description: `${timeFix()}，${t('home')}`,
    })
}
</script>

<style lang="less" scoped>
:deep(.ant-tabs-tab) {
    font-size: 15px;
}
</style>
