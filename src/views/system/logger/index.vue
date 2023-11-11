<template>
    <x-search-bar class="mb-8-2">
        <template #default="{ gutter, colSpan }">
            <a-form
                :label-col="{ style: { width: '80px' } }"
                :model="searchFormData"
                layout="inline">
                <a-row :gutter="gutter">
                    <a-col v-bind="colSpan">
                        <a-form-item
                            name="level"
                            :label="$t('pages.system.logger.form.level')">
                            <a-select v-model:value="searchFormData.level">
                                <a-select-option value="info">INFO</a-select-option>
                                <a-select-option value="warn">WARN</a-select-option>
                                <a-select-option value="error">ERROR</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col v-bind="colSpan">
                        <a-form-item
                            name="trace_id"
                            :label="$t('pages.system.logger.form.trace_id')">
                            <a-input v-model:value="searchFormData.trace_id"></a-input>
                        </a-form-item>
                    </a-col>

                    <!--                    <a-col v-bind="colSpan">-->
                    <!--                        <a-form-item-->
                    <!--                            name="user_id"-->
                    <!--                            label="用户名称">-->
                    <!--                            <a-input-->
                    <!--                                v-model:value="searchFormData.user_id"-->
                    <!--                                placeholder="请输入"></a-input>-->
                    <!--                        </a-form-item>-->
                    <!--                    </a-col>-->
                    <!--                    <a-col v-bind="colSpan">-->
                    <!--                        <a-form-item-->
                    <!--                            name="tag"-->
                    <!--                            label="标签">-->
                    <!--                            <a-select v-model:value="searchFormData.tag">-->
                    <!--                                <a-select-option value="main">main</a-select-option>-->
                    <!--                                <a-select-option value="request">request</a-select-option>-->
                    <!--                            </a-select>-->
                    <!--                        </a-form-item>-->
                    <!--                    </a-col>-->
                    <!--                    <a-col>-->
                    <!--                        <a-form-item label="日志时间">-->
                    <!--                            <a-range-picker-->
                    <!--                                allow-clear-->
                    <!--                                show-time-->
                    <!--                                @change="checkDate"-->
                    <!--                                v-model:value="rangeDate"-->
                    <!--                                placeholder=""></a-range-picker>-->
                    <!--                        </a-form-item>-->
                    <!--                    </a-col>-->
                    <a-col class="align-right">
                        <a-space>
                            <a-button @click="handleResetForm">{{ $t('button.reset') }}</a-button>
                            <a-button
                                ghost
                                type="primary"
                                @click="handleSearch">
                                {{ $t('button.search') }}
                            </a-button>
                        </a-space>
                    </a-col>
                </a-row>
            </a-form>
        </template>
    </x-search-bar>
    <a-card>
        <x-action-bar class="mb-8-2">
            <template #extra>
                <a-space>
                    <a-tooltip :title="$t('app.pwa.serviceworker.updated.ok')">
                        <a-button
                            type="text"
                            @click="handleSearch">
                            <template #icon>
                                <reload-outlined></reload-outlined>
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </x-action-bar>
        <a-table
            :columns="columns"
            :data-source="listData"
            :loading="loading"
            :pagination="paginationState"
            :size="size"
            row-key="id"
            @change="onTableChange">
            <template #expandedRowRender="{ record }">
                <a-row :gutter="[16, 24]">
                    <a-col
                        v-for="(item, index) in record.children"
                        :key="index"
                        class="gutter-row"
                        :span="6">
                        <div class="gutter-box">{{ index }}：{{ item }}</div>
                    </a-col>
                </a-row>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="'levels' === column.key">
                    <a-tag :color="colors[record.level]">{{ record.level }}</a-tag>
                </template>
                <template v-if="'tags' === column.key">
                    <a-tag color="processing">{{ record.tag }}</a-tag>
                </template>

                <template v-if="'createAt' === column.key"> {{ formatUtcDateTime(record.created_at) }} </template>
            </template>
        </a-table>
    </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import apis from '@/apis'
import { config } from '@/config'
import { usePagination } from '@/hooks'
import { formatUtcDateTime } from '@/utils/util'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // 解构出t方法

defineOptions({
    name: 'Logger',
})
const colors = ref({
    info: 'success',
    warn: 'warning',
    error: 'error',
})
const columns = [
    { title: t('pages.system.logger.form.level'), dataIndex: 'level', key: 'levels' },
    { title: t('pages.system.logger.form.trace_id'), dataIndex: 'trace_id' },
    { title: t('pages.system.logger.form.user_name'), dataIndex: 'user_id' },
    { title: t('pages.system.logger.form.tag'), dataIndex: 'tag', key: 'tags' },
    { title: t('pages.system.logger.form.message'), dataIndex: 'message' },
    { title: t('pages.system.logger.form.created_at'), dataIndex: 'created_at', key: 'createAt', width: 180 },
]
const { listData, paginationState, loading, showLoading, hideLoading, resetPagination, searchFormData } =
    usePagination()
const size = ref('default')
const startTime = ref('')
const endTime = ref('')
const rangeDate = ref()
getPageList()

/**
 * 获取分页列表
 */
async function getPageList() {
    try {
        showLoading()
        const { pageSize, current } = paginationState
        const { success, data, total } = await apis.system
            .getLoggers({
                pageSize,
                page: current,
                ...searchFormData.value,
                startTime: startTime.value,
                endTime: endTime.value,
            })
            .catch(() => {
                throw new Error()
            })
        hideLoading()
        if (config('http.code.success') === success) {
            data.forEach((item) => {
                item.children = JSON.parse(item.data)
            })
            listData.value = data
            paginationState.total = total
        }
    } catch (error) {
        hideLoading()
    }
}

/**
 * 选择时间
 */
// function checkDate(date, rangeDate) {
//     startTime.value = rangeDate[0]
//     endTime.value = rangeDate[1]
// }

/**
 * 搜索
 */
function handleSearch() {
    resetPagination()
    getPageList()
}

/**
 * 表格发生改变
 * @param current
 * @param pageSize
 */
function onTableChange({ current, pageSize }) {
    paginationState.current = current
    paginationState.pageSize = pageSize
    getPageList()
}
/**
 * 重置
 * @param current
 * @param pageSize
 */
function handleResetForm() {
    resetPagination()
    searchFormData.value = {}
    startTime.value = ''
    endTime.value = ''
    rangeDate.value = ''
    getPageList()
}
</script>

<style lang="less" scoped></style>
