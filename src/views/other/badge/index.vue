<template>
    <a-card title="基础示例">
        <a-space>
            <a-input v-model:value="form.name"></a-input>
            <a-input-number
                v-model:value="form.count"
                :min="0"></a-input-number>
            <a-button @click="handleSet">设置</a-button>
            <a-button @click="handleClear">清除</a-button>
        </a-space>
    </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { useMenu } from '@/hooks'

defineOptions({
    name: 'otherBadge',
})

const form = ref({
    name: 'home',
    count: 10,
})
const { setBadge } = useMenu()

function handleSet() {
    setBadge(form.value?.name, form.value?.count)
}

function handleClear() {
    setBadge(form.value?.name, 0)
}
</script>

<style lang="less" scoped></style>
