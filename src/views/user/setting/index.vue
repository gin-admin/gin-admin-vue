<template>
    <a-card :body-style="{ paddingLeft: 0, paddingRight: 0 }">
        <a-row type="flex">
            <a-col flex="0 0 224px">
                <a-menu
                    v-model:selectedKeys="selectedKeys"
                    mode="inline">
                    <a-menu-item
                        v-for="item in menuList"
                        :key="item.key"
                        >{{ item.name }}
                    </a-menu-item>
                </a-menu>
            </a-col>
            <a-col
                class="px-8-5"
                flex="auto">
                <div class="setting-title">{{ cpSelectedMenu.name }}</div>
                <keep-alive>
                    <component :is="cpSelectedMenu.component"></component>
                </keep-alive>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup>
import { find, head } from 'lodash-es'
import { computed, markRaw, ref } from 'vue'

import Basic from './components/Basic.vue'
import Safe from './components/Safe.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineOptions({
    name: 'userSetting',
})

const menuList = ref([
    { name: t('app.settings.menuMap.basic'), key: 'basic', component: markRaw(Basic) },
    { name: t('app.settings.menuMap.security'), key: 'safe', component: markRaw(Safe) },
])
const selectedKeys = ref(['basic'])
const cpSelectedMenu = computed(() => find(menuList.value, { key: head(selectedKeys.value) }))
</script>

<style lang="less" scoped>
:deep(.setting-title) {
    font-size: 20px;
    color: @color-text-heading;
    margin-bottom: 16px;
}
</style>
