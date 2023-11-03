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
                            label="用户名"
                            name="username">
                            <a-input
                                placeholder="请输入"
                                v-model:value="searchFormData.username"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col v-bind="colSpan">
                        <a-form-item name="name">
                            <template #label>
                                姓名
                                <a-tooltip title="姓名">
                                    <question-circle-outlined class="ml-4-1 color-placeholder" />
                                </a-tooltip>
                            </template>
                            <a-input
                                placeholder="请输入"
                                v-model:value="searchFormData.name"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col
                        class="align-right"
                        v-bind="colSpan">
                        <a-space>
                            <a-button @click="handleResetSearch">重置</a-button>
                            <a-button
                                ghost
                                type="primary"
                                @click="handleSearch">
                                搜索
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
                        type="primary"
                        @click="$refs.editDialogRef.handleCreate()">
                        <template #icon>
                            <plus-outlined></plus-outlined>
                        </template>
                        添加
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
                                v-if="statusUserTypeEnum.is('activated', record.status)"
                                color="processing">
                                {{ statusUserTypeEnum.getDesc(record.status) }}
                            </a-tag>
                            <!--状态-->
                            <a-tag
                                v-if="statusUserTypeEnum.is('freezed', record.status)"
                                color="processing">
                                {{ statusUserTypeEnum.getDesc(record.status) }}
                            </a-tag>
                        </template>

                        <template v-if="'createAt' === column.key">
                            {{ formatUtcDateTime(record.created_at) }}
                        </template>
                        <template v-if="'action' === column.key">
                            <x-action-button @click="$refs.editDialogRef.handleEdit(record)">
                                <a-tooltip>
                                    <template #title>编辑</template>
                                    <edit-outlined /> </a-tooltip
                            ></x-action-button>
                            <x-action-button @click="handleDelete(record)">
                                <a-tooltip>
                                    <template #title>删除</template>
                                    <delete-outlined style="color: #ff4d4f" /> </a-tooltip
                            ></x-action-button>
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
import { statusUserTypeEnum } from '@/enums/system'
import { usePagination } from '@/hooks'

import EditDialog from './components/EditDialog.vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

defineOptions({
    name: 'systemUser',
})

const columns = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'statusType', width: 60 },
    { title: '添加日期', key: 'createAt', fixed: 'right', width: 120 },
    { title: '操作', key: 'action', fixed: 'right', width: 100 },
]

const { listData, loading, showLoading, hideLoading, paginationState, resetPagination, searchFormData } =
    usePagination()

const editDialogRef = ref()
getPageList()
/**
 * 获取用户列表
 * @returns {Promise<void>}
 */
async function getPageList() {
    console.log('搜索')
    try {
        showLoading()
        const { pageSize, current } = paginationState
        const { success, data, total } = await apis.users
            .getUsersList({
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
        console.log('weer', error)
        hideLoading()
    }
}

/**
 * 删除
 */
function handleDelete({ id }) {
    Modal.confirm({
        title: '删除提示',
        content: '确认删除？',
        okText: '确认',
        onOk: () => {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    try {
                        const { success } = await apis.users.delUsers(id).catch(() => {
                            throw new Error()
                        })
                        if (config('http.code.success') === success) {
                            resolve()
                            message.success('删除成功')
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
 * 搜索
 */
function handleSearch() {
    resetPagination()
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
 * 编辑完成
 */
async function onOk() {
    message.success('操作成功')
    await getPageList()
}
</script>

<style lang="less" scoped></style>
