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
                            label="名称"
                            name="name">
                            <a-input
                                placeholder="请输入"
                                v-model:value="searchFormData.name"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col v-bind="colSpan">
                        <a-form-item name="code">
                            <template #label>
                                编码
                                <a-tooltip title="编码 key">
                                    <question-circle-outlined class="ml-4-1 color-placeholder" />
                                </a-tooltip>
                            </template>
                            <a-input
                                placeholder="请输入"
                                v-model:value="searchFormData.code"></a-input>
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
    <a-card>
        <x-action-bar class="mb-8-2">
            <a-button
                v-action="'add'"
                type="primary"
                @click="$refs.editDialogRef.handleCreate()">
                <template #icon>
                    <plus-outlined></plus-outlined>
                </template>
                添加
            </a-button>
        </x-action-bar>
        <a-table
            rowKey="id"
            :loading="loading"
            :pagination="true"
            :columns="columns"
            :data-source="listData">
            <template #bodyCell="{ column, record }">
                <template v-if="'menuType' === column.key">
                    <!--菜单-->
                    <a-tag
                        v-if="menuTypeEnum.is('page', record.type)"
                        color="processing">
                        {{ menuTypeEnum.getDesc(record.type) }}
                    </a-tag>
                    <!--按钮-->
                    <a-tag
                        v-if="menuTypeEnum.is('button', record.type)"
                        color="success">
                        {{ menuTypeEnum.getDesc(record.type) }}
                    </a-tag>
                </template>

                <template v-if="'createAt' === column.key">
                    {{ formatUtcDateTime(record.created_at) }}
                </template>

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

                <template v-if="'action' === column.key">
                    <x-action-button @click="$refs.editDialogRef.handleEdit(record)">
                        <a-tooltip>
                            <template #title>编辑</template>
                            <edit-outlined />
                        </a-tooltip>
                    </x-action-button>

                    <x-action-button @click="$refs.editDialogRef.handleCreateChild(record)">
                        <a-tooltip>
                            <template #title>添加下级</template>
                            <plus-circle-outlined />
                        </a-tooltip>
                    </x-action-button>
                    <x-action-button @click="handleDelete(record)">
                        <a-tooltip>
                            <template #title>删除</template>
                            <delete-outlined style="color: #ff4d4f" />
                        </a-tooltip>
                    </x-action-button>
                </template>
            </template>
        </a-table>
    </a-card>

    <edit-dialog
        @ok="onOk"
        ref="editDialogRef" />
</template>

<script setup>
import { Modal, message } from 'ant-design-vue'
import { ref } from 'vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import apis from '@/apis'
import { config } from '@/config'
import { menuTypeEnum, statusTypeEnum } from '@/enums/system'
import { usePagination, useForm } from '@/hooks'
import { formatUtcDateTime } from '@/utils/util'
import EditDialog from './components/EditDialog.vue'

defineOptions({
    name: 'systemMenu',
})

const columns = ref([
    { title: '名称', dataIndex: 'name', key: 'name', fixed: true },
    { title: '编码', dataIndex: 'code', key: 'code' },

    { title: '类型', dataIndex: 'type', key: 'menuType', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'statusType', width: 80 },
    { title: '排序', dataIndex: 'sequence', width: 80 },
    { title: '创建时间', dataIndex: 'created_at', key: 'createAt', width: 180 },
    { title: '操作', key: 'action', width: 180 },
])
const { listData, loading, showLoading, hideLoading, searchFormData, paginationState, resetPagination } =
    usePagination()
const { resetForm } = useForm()
const editDialogRef = ref()

getMenuList()

/**
 * 获取菜单列表
 * @return {Promise<void>}
 */
async function getMenuList() {
    try {
        showLoading()
        // const { current } = paginationState
        const { data, success, total } = await apis.menu
            .getMenuList({
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
 * 搜索
 */
function handleSearch() {
    resetForm()
    resetPagination()
    getMenuList()
}
/**
 * 重置
 */
function handleResetSearch() {
    searchFormData.value = {}
    resetPagination()
    getMenuList()
}
/**
 * 删除
 * @param id
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
                        const { success } = await apis.menu.delMenu(id).catch(() => {
                            throw new Error()
                        })
                        if (config('http.code.success') === success) {
                            resolve()
                            message.success('删除成功')
                            await getMenuList()
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
 * 编辑完成
 */
async function onOk() {
    message.success('操作成功')
    await getMenuList()
}
</script>

<style lang="less" scoped></style>
