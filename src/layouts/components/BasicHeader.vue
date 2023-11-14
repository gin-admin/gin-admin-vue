<template>
    <a-layout-header
        class="basic-header"
        :class="cpClassNames"
        :style="cpStyles">
        <!-- 左侧 -->
        <div
            v-if="cpShowLeftSlot"
            class="basic-header__left">
            <slot name="left"></slot>
        </div>
        <!-- 中间 -->
        <div
            v-if="cpShowDefaultSlot"
            class="basic-header__center">
            <slot></slot>
        </div>
        <!-- 右侧 -->
        <div class="basic-header__right">
            <a-space :size="16">
                <action-button @click="handleConfig">
                    <setting-outlined></setting-outlined>
                </action-button>
                <a-dropdown :trigger="['hover']">
                    <action-button :style="{ height: '44px' }">
                        <translation-outlined />
                    </action-button>
                    <a-spin />
                    <template #overlay>
                        <a-menu v-model:selectedKeys="current">
                            <a-menu-item
                                v-for="(item, key) in langData"
                                :key="key"
                                @click="handleLang(key)">
                                {{ item.icon }} {{ item.label }}
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

                <a-dropdown :trigger="['click']">
                    <action-button :style="{ height: '44px' }">
                        <a-avatar
                            class="mr-8-1 display-inline-flex justify-content-center"
                            :size="24"
                            :src="userInfo?.avatar">
                        </a-avatar>
                        <span>{{ userInfo?.name }}</span>
                    </action-button>
                    <a-spin />
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                key="edit"
                                @click="handleOpen">
                                <edit-outlined />
                                {{ $t('component.RightContent.profile') }}
                            </a-menu-item>
                            <a-menu-item
                                key="logout"
                                @click="handleLogout">
                                <login-outlined></login-outlined>
                                {{ $t('component.RightContent.logout') }}
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-space>
        </div>
    </a-layout-header>
</template>

<script setup>
import { Modal } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, useSlots, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LoginOutlined, SettingOutlined, EditOutlined, TranslationOutlined } from '@ant-design/icons-vue'
import { useAppStore, useUserStore } from '@/store'
import ActionButton from './ActionButton.vue'
import { theme as antTheme } from 'ant-design-vue'
import { config as conf } from '@/config'
import { useI18n } from 'vue-i18n'
import storage from '@/utils/storage'

const { locale, t } = useI18n()
defineOptions({
    name: 'BasicHeader',
})

/**
 * @property {string} theme 主题【light=亮色，dark=暗色】
 */
const props = defineProps({
    theme: {
        type: String,
    },
})
const emit = defineEmits(['config'])

const slots = useSlots(['default', 'left', 'right'])

const userStore = useUserStore()
const appStore = useAppStore()

const router = useRouter()
const { config } = storeToRefs(appStore)
const { userInfo } = storeToRefs(userStore)
const { token } = antTheme.useToken()

const cpClassNames = computed(() => ({
    [`basic-header--${props.theme}`]: true,
}))
const cpStyles = computed(() => {
    const styles = {
        zIndex: config.value.layout === 'topBottom' ? 120 : 110,
    }

    if (config.value.headerTheme === 'light') {
        styles.boxShadow = `0 0 0 1px ${token.value.colorSplit}`
    }

    return styles
})
const cpShowLeftSlot = computed(() => !!slots.left)
const cpShowDefaultSlot = computed(() => !!slots.default)
const defaultLang = storage.local.getItem(conf('storage.lang')) || 'zh-ch'
const current = ref(defaultLang)
const langData = ref({
    'zh-ch': {
        lang: 'zh-ch',
        label: '简体中文',
        icon: '🇨🇳',
        title: '语言',
    },
    'en-us': {
        lang: 'en-us',
        label: 'English',
        icon: '🇺🇸',
        title: 'Language',
    },
})

/**
 * 退出登录
 */
function handleLogout() {
    Modal.confirm({
        title: t('component.RightContent.logout'),
        okText: t('button.confirm'),
        cancelText: t('button.cancel'),
        onOk: () => {
            userStore.logout().then(() => {
                router.push({
                    name: 'login',
                })
            })
        },
    })
}

/**
 * 修改资料
 */

function handleOpen() {
    router.push({
        name: 'setting',
    })
}

/**
 * 切换语言
 */

function handleLang(lang) {
    storage.local.setItem(conf('storage.lang'), lang)
    locale.value = lang
    current.value = lang
    location.reload()
}
/**
 * 配置
 */
function handleConfig() {
    emit('config')
}
</script>

<style lang="less" scoped>
.basic-header {
    height: v-bind('config.headerHeight + "px"');
    line-height: 1;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding-inline: 16px;
    // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    &__left {
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    &__center {
        flex: auto;
        min-width: 0;
    }

    &__right {
        flex-shrink: 0;
        margin: 0 0 0 auto;
        display: flex;
        align-items: center;
    }

    :deep(.ant-menu-horizontal) {
        border: none;
        line-height: v-bind('config.headerHeight + "px"');
    }

    &--light {
        background: #fff;
    }

    &--dark {
        color: #fff;

        :deep(.action-btn) {
            &:hover {
                background: #252a3d;
            }
        }
    }

    :deep(.basic-menu) {
        .basic-menu__title {
            .ant-badge {
                margin-top: -2px;
            }
        }
    }
}
</style>
