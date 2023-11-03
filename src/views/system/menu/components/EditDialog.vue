<template>
    <a-modal
        :width="640"
        :open="modal.open"
        :title="modal.title"
        :confirm-loading="modal.confirmLoading"
        :after-close="onAfterClose"
        :cancel-text="cancelText"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form
            layout="vertical"
            ref="formRef"
            :model="formData"
            :rules="formRules">
            <a-card class="mb-8-2">
                <a-row :gutter="12">
                    <a-col :span="12">
                        <a-form-item
                            label="所属上级"
                            name="parent_id">
                            <a-tree-select
                                v-model:value="formData.parent_id"
                                tree-default-expand-all></a-tree-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="类型"
                            name="type">
                            <a-radio-group
                                v-model:value="formData.type"
                                :options="menuTypeEnum.getOptions()"></a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="名称"
                            name="name">
                            <a-input v-model:value="formData.name"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="访问地址"
                            name="path">
                            <a-input v-model:value="formData.path"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="code">
                            <template #label>
                                <span class="mr-4-1">编码</span>
                                <a-tooltip title="系统唯一且与内置组件名一致，否则导致缓存失效">
                                    <question-circle-outlined class="color-secondary"></question-circle-outlined>
                                </a-tooltip>
                            </template>
                            <a-input v-model:value="formData.code"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                            label="启用状态"
                            name="status">
                            <a-radio-group
                                v-model:value="formData.status"
                                :options="statusTypeEnum.getOptions()"></a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            style="width: 200px"
                            label="排序值"
                            name="sequence">
                            <a-input
                                :defaultValue="0"
                                type="number"
                                v-model:value="formData.sequence"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="描述"
                            name="description">
                            <a-input v-model:value="formData.description"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item
                            label="属性json"
                            name="properties">
                            <a-textarea v-model:value="formData.properties"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
            <a-card title="API管理">
                <a-table
                    :columns="columns"
                    :data-source="formData.resources"
                    :pagination="false"
                    row-key="id">
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'types'">
                            <a-form-item label="请求类型">
                                <a-input-group
                                    style="display: inline-block; vertical-align: middle"
                                    :compact="true">
                                    <a-form-item-rest>
                                        <a-select
                                            v-model:value="record.method"
                                            :default-value="record.method || 'GET'"
                                            style="width: 100px">
                                            <a-select-option
                                                v-for="item of reqType"
                                                :key="item"
                                                :value="item"
                                                >{{ item }}</a-select-option
                                            >
                                        </a-select>
                                    </a-form-item-rest>
                                    <a-input
                                        v-model:value="record.path"
                                        :style="{ width: 'calc(100% - 100px)' }" />
                                </a-input-group>
                            </a-form-item>
                        </template>
                        <template v-if="column.key === 'action'">
                            <x-action-button @click="handleDelete(index)">删除</x-action-button>
                        </template>
                    </template>
                </a-table>

                <a-button
                    @click="handleAddApi"
                    block
                    class="mt-8-2"
                    type="dashed">
                    <template #icon>
                        <plus-outlined></plus-outlined>
                    </template>
                    添加数据
                </a-button>
            </a-card>
            <template v-if="menuTypeEnum.is('menu', formData.type)"> </template>
            <template v-if="statusTypeEnum.is('enabled', formData.status)"> </template>
        </a-form>
    </a-modal>
</template>

<script setup>
import { cloneDeep } from 'lodash-es'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import apis from '@/apis'
import { useModal, useForm } from '@/hooks'
import { menuTypeEnum, statusTypeEnum } from '@/enums/system'
import { ref } from 'vue'
import { config } from '@/config'

const emit = defineEmits(['ok'])

const { modal, showModal, hideModal, showLoading, hideLoading } = useModal()
const { formData, formRef, formRules, resetForm } = useForm()

formRules.value = {
    name: { required: true, message: '请输入名称' },
    code: { required: true, message: '请输入编码' },
}

const columns = [
    { title: '请求类型/路径', dataIndex: 'types', key: 'types' },
    { title: '操作', dataIndex: 'action', key: 'action' },
]
const reqType = ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE']
const cancelText = ref('取消')

/**
 * 新建
 */
function handleCreate() {
    formData.value.resources = []
    showModal({
        type: 'create',
        title: '新建菜单',
    })
}

/**
 * 添加下级
 * handleCreateChild
 */

function handleCreateChild(record = {}) {
    formData.value.resources = []
    showModal({
        type: 'create',
        title: '新建下级菜单',
    })
    formData.value.parent_id = record.id
}

/**
 * 编辑
 */
async function handleEdit(record = {}) {
    showModal({
        type: 'edit',
        title: '编辑菜单',
    })
    const { data } = await apis.menu.getMenu(record.id).catch(() => {
        throw new Error()
    })
    formData.value = cloneDeep(data)
    formData.value.properties = JSON.parse(formData.value.properties)
    formData.value.resources = formData.value.resources || (formData.value.resources = [])
}

/**
 * 确定
 */
function handleOk() {
    formRef.value
        .validateFields()
        .then(async (values) => {
            try {
                showLoading()
                const params = {
                    ...values,
                }
                params.sequence = Number.parseInt(params.sequence) || 0
                params.properties = JSON.stringify(params.properties)
                let result = null
                switch (modal.value.type) {
                    case 'create':
                        result = await apis.menu.createMenu(params).catch(() => {
                            throw new Error()
                        })

                        break
                    case 'edit':
                        newApiData()
                        params.resources = formData.value.resources
                        result = await apis.menu.updateMenu(formData.value.id, params).catch(() => {
                            throw new Error()
                        })
                        break
                }
                hideLoading()
                if (config('http.code.success') === result?.success) {
                    hideModal()
                    emit('ok')
                }
            } catch (error) {
                console.log(error, '修改错误')
                hideLoading()
            }
        })
        .catch(() => {
            hideLoading()
        })
}

/**
 * 取消
 */
function handleCancel() {
    hideModal()
}

/**
 * 针对API 做一次 menu_id
 */
function newApiData() {
    if (formData.value.resources)
        formData.value.resources.forEach((item) => {
            item.menu_id = formData.value.id
        })
}

/**
 * 关闭后
 */
function onAfterClose() {
    resetForm()
    hideLoading()
}

/**
 * 添加API
 */

function handleAddApi() {
    formData.value.resources.push({
        method: 'GET',
        path: '',
    })
} /**
 * 删除API
 */

function handleDelete(index) {
    formData.value.resources.splice(index, 1)
}

defineExpose({
    handleCreate,
    handleCreateChild,
    handleEdit,
})
</script>

<style lang="less" scoped></style>
