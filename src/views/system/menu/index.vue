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
                            :label="$t('pages.system.menu.form.name')"
                            name="name">
                            <a-input
                                :placeholder="$t('pages.system.menu.form.name.placeholder')"
                                v-model:value="searchFormData.name"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col v-bind="colSpan">
                        <a-form-item name="code">
                            <template #label>
                                {{ $t('pages.system.menu.form.code') }}
                                <a-tooltip :title="$t('pages.system.menu.form.code')">
                                    <question-circle-outlined class="ml-4-1 color-placeholder" />
                                </a-tooltip>
                            </template>
                            <a-input
                                :placeholder="$t('pages.system.menu.form.code.placeholder')"
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
    <a-card>
        <x-action-bar class="mb-8-2">
            <a-button
                v-action="'add'"
                type="primary"
                @click="$refs.editDialogRef.handleCreate()">
                <template #icon>
                    <plus-outlined></plus-outlined>
                </template>
                {{ $t('pages.system.menu.add') }}
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
                            <template #title>{{ $t('pages.system.menu.edit') }}</template>
                            <edit-outlined />
                        </a-tooltip>
                    </x-action-button>

                    <x-action-button @click="$refs.editDialogRef.handleCreateChild(record)">
                        <a-tooltip>
                            <template #title>{{ $t('pages.system.menu.button.addChild') }}</template>
                            <plus-circle-outlined />
                        </a-tooltip>
                    </x-action-button>
                    <x-action-button @click="handleDelete(record)">
                        <a-tooltip>
                            <template #title>{{ $t('pages.system.delete') }}</template>
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
import { useI18n } from 'vue-i18n'
defineOptions({
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'menu',
})
const { t } = useI18n() // 解构出t方法
const columns = ref([
    { title: t('pages.system.menu.form.name'), dataIndex: 'name', key: 'name', fixed: true },
    { title: t('pages.system.menu.form.code'), dataIndex: 'code', key: 'code' },

    { title: t('pages.system.menu.form.type'), dataIndex: 'type', key: 'menuType', width: 80 },
    { title: t('pages.system.menu.form.status'), dataIndex: 'status', key: 'statusType', width: 80 },
    { title: t('pages.system.menu.form.sequence'), dataIndex: 'sequence', width: 100 },
    { title: t('pages.system.menu.form.created_at'), dataIndex: 'created_at', key: 'createAt', width: 180 },
    { title: t('button.action'), key: 'action', width: 180 },
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
        title: t('pages.system.menu.delTip'),
        content: t('button.confirm'),
        okText: t('button.confirm'),
        onOk: () => {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    try {
                        const { success } = await apis.menu.delMenu(id).catch(() => {
                            throw new Error()
                        })
                        if (config('http.code.success') === success) {
                            resolve()
                            message.success(t('component.message.success.delete'))
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
    message.success(t('component.message.success.delete'))
    await getMenuList()
}
</script>

<style lang="less" scoped></style>
