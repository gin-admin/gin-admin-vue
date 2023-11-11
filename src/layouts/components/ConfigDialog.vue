<template>
    <a-drawer
        v-model:open="open"
        :title="$t('app.setting.pagestyle')"
        :closable="false"
        :width="360">
        <a-form
            label-align="left"
            :colon="false"
            :label-col="{ span: 24 }">
            <!--            <div class="mb-8-2 fw-600">菜单设置</div>-->
            <a-form-item
                :label="$t('app.setting.navigationmode')"
                class="mb-8-2"
                :label-col="{ flex: 'auto' }"
                :wrapper-col="{ style: { flex: '0 0 auto' } }">
                <a-select
                    v-model:value="config.layout"
                    :options="layoutList"
                    @change="onChange"></a-select>
            </a-form-item>
            <a-form-item
                :label="$t('app.setting.navigationmode')"
                class="mb-8-2"
                :label-col="{ flex: 'auto' }"
                :wrapper-col="{ style: { flex: '0 0 auto' } }">
                <a-select
                    v-model:value="config.menuMode"
                    :options="menuModeList"
                    @change="onChange"></a-select>
            </a-form-item>
            <a-form-item
                :label="$t('app.setting.topBottom')"
                class="mb-8-2"
                :label-col="{ flex: 'auto' }"
                :wrapper-col="{ style: { flex: '0 0 auto' } }">
                <a-select
                    v-model:value="config.headerTheme"
                    :options="themeList"
                    @change="onChange"></a-select>
            </a-form-item>
            <a-form-item
                :label="$t('app.setting.leftRight')"
                class="mb-8-2"
                :label-col="{ flex: 'auto' }"
                :wrapper-col="{ style: { flex: '0 0 auto' } }">
                <a-select
                    v-model:value="config.sideTheme"
                    :options="themeList"
                    @change="onChange"></a-select>
            </a-form-item>
            <!--            <a-divider></a-divider>-->
            <!--            <div class="mb-8-2 fw-600">内容区域</div>-->
            <!--            <a-form-item-->
            <!--                label="标签页"-->
            <!--                :label-col="{ flex: 'auto' }"-->
            <!--                :wrapper-col="{ style: { flex: '0 0 auto' } }">-->
            <!--                <a-switch-->
            <!--                    v-model:checked="config.multiTab"-->
            <!--                    size="small"-->
            <!--                    @change="onChange"></a-switch>-->
            <!--            </a-form-item>-->
        </a-form>
    </a-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from '@/store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const appStore = useAppStore()

const { config } = storeToRefs(appStore)

const open = ref(false)
const layoutList = ref([
    { value: 'topBottom', label: t('app.setting.topBottom') },
    { value: 'leftRight', label: t('app.setting.leftRight') },
])
const themeList = ref([
    { value: 'light', label: t('app.setting.pagestyle.light') },
    { value: 'dark', label: t('app.setting.pagestyle.dark') },
])
const menuModeList = ref([
    { value: 'side', label: t('app.setting.sidemenu') },
    { value: 'top', label: t('app.setting.topmenu') },
    // { value: 'mix', label: '混合菜单' },
])

function handleOpen() {
    open.value = true
}

function onChange() {
    appStore.updateConfig()
}

defineExpose({
    handleOpen,
})
</script>

<style lang="less" scoped></style>
