<template>
    <a-modal
        :open="modal.open"
        :title="modal.title"
        :width="640"
        :confirm-loading="modal.confirmLoading"
        :after-close="onAfterClose"
        :cancel-text="cancelText"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            :label-col="{ style: { width: '90px' } }">
            <a-card class="mb-8-2">
                <a-row :gutter="12">
                    <a-col :span="12">
                        <a-form-item
                            label="名称"
                            name="name">
                            <a-input v-model:value="formData.name"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                            label="编码"
                            name="code">
                            <a-input v-model:value="formData.code"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                            label="描述"
                            name="description">
                            <a-textarea v-model:value="formData.description"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
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
                            label="状态"
                            name="status">
                            <a-radio-group
                                v-model:value="formData.status"
                                :options="[
                                    { label: '启用', value: 'enabled' },
                                    { label: '禁用', value: 'disabled' },
                                ]"></a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
                    <a-tree
                        v-model:checkedKeys="checkedKeys"
                        checkable
                        :tree-data="treeData">
                    </a-tree>
                </a-row>
            </a-card>
        </a-form>
    </a-modal>
</template>

<script setup>
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import { ref, watch } from 'vue'
import { config } from '@/config'
import apis from '@/apis'
import { useForm, useModal } from '@/hooks'
import { toMenuTree } from '@/utils/util'

const emit = defineEmits(['ok'])

const { modal, showModal, hideModal, showLoading, hideLoading } = useModal()
const { formRecord, formData, formRef, formRules, resetForm } = useForm()
const cancelText = ref('取消')

formRules.value = {
    name: { required: true, message: '请输入名称' },
    code: { required: true, message: '请输入编码' },
    status: { required: true, message: '请选择状态' },
}

/**
 * 权限数据节点
 */
const treeData = ref([])
const checkedKeys = ref([])
async function getMenus() {
    const { data } = await apis.menu.getMenuList().catch(() => {
        throw new Error()
    })

    treeData.value = formatData(data)
}

getMenus()

function formatData(data) {
    return toMenuTree(data)
}

watch(checkedKeys, () => {
    console.log('checkedKeys', checkedKeys)
})

/**
 * 新建
 */
function handleCreate() {
    showModal({
        type: 'create',
        title: '新建角色',
    })
}

/**
 * 编辑
 */
async function handleEdit(record = {}) {
    showModal({
        type: 'edit',
        title: '编辑角色',
    })

    const { data, success } = await apis.role.getRole(record.id).catch()
    if (!success) {
        message.error('当前数据不存在')
        hideModal()
        return
    }
    let menus = []
    if (data.menus) {
        for (let item of data.menus) {
            menus.push(item.menu_id)
        }
    }
    checkedKeys.value = menus
    formRecord.value = data
    formData.value = cloneDeep(data)
}

/**
 * 确定
 */
function handleOk() {
    formRef.value
        .validateFields()
        .then(async (values) => {
            const menus = []
            for (const item of checkedKeys.value) {
                menus.push({
                    menu_id: item,
                })
            }

            try {
                showLoading()
                const params = {
                    ...values,
                    menus,
                }
                let result = null
                // params.sequence ? params.sequence : (params.sequenc = 0)
                console.log(params, '提交数据')
                switch (modal.value.type) {
                    case 'create':
                        result = await apis.role.createRole(params).catch(() => {
                            throw new Error()
                        })
                        break
                    case 'edit':
                        result = await apis.role.updateRole(formData.value.id, params).catch(() => {
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
                console.log(error, '异常数据')
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
 * 关闭后
 */
function onAfterClose() {
    resetForm()
    hideLoading()
}

defineExpose({
    handleCreate,
    handleEdit,
})
</script>

<style lang="less" scoped></style>
