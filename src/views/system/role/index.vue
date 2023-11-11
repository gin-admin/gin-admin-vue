<template>
    <x-search-bar class="mb-8-2">
        <template #default="{ gutter, colSpan }">
            <a-form
                :label-col="{ style: { width: '100px' } }"
                :model="searchFormData"
                layout="inline">
                <a-row :gutter="gutter">
                    <a-col v-bind="colSpan">
                        <a-form-item
                            :label="$t('pages.system.role.form.name')"
                            name="name">
                            <a-input
                                :placeholder="$t('pages.system.role.form.code.placeholder')"
                                v-model:value="searchFormData.name"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col v-bind="colSpan">
                        <a-form-item name="code">
                            <template #label>
                                {{ $t('pages.system.role.form.code') }}
                                <a-tooltip :title="$t('pages.system.role.form.code')">
                                    <question-circle-outlined class="ml-4-1 color-placeholder" />
                                </a-tooltip>
                            </template>
                            <a-input
                                :placeholder="$t('pages.system.role.form.code.placeholder')"
                                v-model:value="searchFormData.code"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col
                        class="align-right"
                        v-bind="colSpan">
                        <a-space>
                            <a-button @click="handleResetSearch">{{ $t('button.reset') }}</a-button>
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
    <a-row
        :gutter="8"
        :wrap="false">
        <a-col flex="auto">
            <a-card type="flex">
                <x-action-bar class="mb-8-2">
                    <a-button
                        v-action="'add'"
                        type="primary"
                        @click="$refs.editDialogRef.handleCreate()">
                        <template #icon>
                            <plus-outlined></plus-outlined>
                        </template>
                        {{ $t('pages.system.role.add') }}
                    </a-button>
                </x-action-bar>
                <a-table
                    :columns="columns"
                    :data-source="listData"
                    :loading="loading"
                    :pagination="paginationState"
                    :scroll="{ x: 1000 }"
                    @change="onTableChange">
                    <template #bodyCell="{ column, record }">
                        <template v-if="'statusType' === column.key">
                            <!--状态-->
                            <a-tag
                                v-if="statusTypeEnum.is('enabled', record.status)"
                                color="processing">
                                {{ statusTypeEnum.getDesc(record.status) }}
                            </a-tag>
                            <!--状态-->
                            <a-tag
                                v-if="statusTypeEnum.is('disabled', record.status)"
                                color="processing">
                                {{ statusTypeEnum.getDesc(record.status) }}
                            </a-tag>
                        </template>

                        <template v-if="'createAt' === column.key">
                            {{ formatUtcDateTime(record.created_at) }}
                        </template>

                        <template v-if="'action' === column.key">
                            <x-action-button @click="$refs.editDialogRef.handleEdit(record)">
                                <a-tooltip>
                                    <template #title> {{ $t('pages.system.role.edit') }}</template>
                                    <edit-outlined />
                                </a-tooltip>
                            </x-action-button>
                            <x-action-button @click="handleRemove(record)">
                                <a-tooltip>
                                    <template #title> {{ $t('pages.system.delete') }}</template>
                                    <delete-outlined style="color: #ff4d4f" />
                                </a-tooltip>
                            </x-action-button>
                        </template>
                    </template>
                </a-table>
            </a-card>
        </a-col>
    </a-row>

    <edit-dialog
        ref="editDialogRef"
        @ok="onOk"></edit-dialog>
</template>

<script setup>
import { message, Modal } from 'ant-design-vue'
import { ref } from 'vue'
import apis from '@/apis'
import { formatUtcDateTime } from '@/utils/util'
import { config } from '@/config'
import { statusTypeEnum } from '@/enums/system'
import { usePagination, useForm } from '@/hooks'
import EditDialog from './components/EditDialog.vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

defineOptions({
    name: 'systemRole',
})
const { t } = useI18n() // 解构出t方法
const columns = [
    { title: t('pages.system.role.form.code'), dataIndex: 'code', width: 240 },
    { title: t('pages.system.role.form.name'), dataIndex: 'name' },
    { title: t('pages.system.role.form.status'), dataIndex: 'status', key: 'statusType', width: 80 },
    { title: t('pages.system.role.form.sequence'), dataIndex: 'sequence', width: 80 },
    { title: t('pages.system.role.form.created_at'), key: 'createAt', fixed: 'right', width: 120 },
    { title: t('button.action'), key: 'action', fixed: 'right', width: 120 },
]

const { listData, loading, showLoading, hideLoading, paginationState, searchFormData, resetPagination } =
    usePagination()
const { resetForm } = useForm()
const editDialogRef = ref()

getPageList()

/**
 * 获取用户列表
 * @returns {Promise<void>}
 */
async function getPageList() {
    try {
        showLoading()
        const { pageSize, current } = paginationState
        const { success, data, total } = await apis.role
            .getRoleList({
                pageSize,
                page: current,
                ...searchFormData.value,
            })
            .catch(() => {
                throw new Error()
            })
        hideLoading()
        if (config('http.code.success') === success) {
            listData.value = data
            paginationState.total = total
        }
    } catch (error) {
        hideLoading()
    }
}

/**
 * 移除
 */
function handleRemove({ id }) {
    Modal.confirm({
        title: t('pages.system.role.delTip'),
        content: t('button.confirm'),
        okText: t('button.confirm'),
        onOk: () => {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    try {
                        const { success } = await apis.role.delRole(id).catch(() => {
                            throw new Error()
                        })
                        if (config('http.code.success') === success) {
                            resolve()
                            message.success(t('component.message.success.delete'))
                            await getPageList()
                        }
                    } catch (error) {
                        reject()
                    }
                })()
            })
        },
    })
}

/**
 * 分页
 */
function onTableChange({ current, pageSize }) {
    paginationState.current = current
    paginationState.pageSize = pageSize
    getPageList()
}

/**
 * 重置
 */
function handleResetSearch() {
    searchFormData.value = {}
    resetPagination()
    getPageList()
}

/**
 * 搜索
 */
function handleSearch() {
    resetForm()
    resetPagination()
    getPageList()
}

/**
 * 编辑完成
 */
async function onOk() {
    await getPageList()
}
</script>

<style lang="less" scoped></style>
