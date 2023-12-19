<template>
    <a-modal
        :open="modal.open"
        :title="modal.title"
        :width="640"
        :confirm-loading="modal.confirmLoading"
        :after-close="onAfterClose"
        :cancel-text="cancelText"
        :ok-text="okText"
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
                            :label="$t('pages.system.role.form.name')"
                            name="name">
                            <a-input v-model:value="formData.name"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.role.form.code')"
                            name="code">
                            <a-input v-model:value="formData.code"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item
                            :label="$t('pages.system.role.form.description')"
                            name="description">
                            <a-textarea v-model:value="formData.description"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
                    <a-col :span="12">
                        <a-form-item
                            style="width: 200px"
                            :label="$t('pages.system.role.form.sequence')"
                            name="sequence">
                            <a-input
                                :defaultValue="0"
                                type="number"
                                v-model:value="formData.sequence"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.role.form.status')"
                            name="status">
                            <a-radio-group
                                v-model:value="formData.status"
                                :options="[
                                    { label: $t('pages.system.role.form.status.enabled'), value: 'enabled' },
                                    { label: $t('pages.system.role.form.status.disabled'), value: 'disabled' },
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

const emit = defineEmits(['ok'])
import { useI18n } from 'vue-i18n'
const { modal, showModal, hideModal, showLoading, hideLoading } = useModal()
const { formRecord, formData, formRef, formRules, resetForm } = useForm()
const { t } = useI18n() // 解构出t方法
const cancelText = ref(t('button.cancel'))
const okText = ref(t('button.confirm'))
formRules.value = {
    name: { required: true, message: t('pages.system.role.form.name.placeholder') },
    code: { required: true, message: t('pages.system.role.form.code.placeholder') },
    status: { required: true, message: t('pages.system.role.form.status.placeholder') },
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

    treeData.value = toMenuTrees(data)
}

getMenus()

watch(checkedKeys, () => {
    console.log('checkedKeys', checkedKeys)
})

function toMenuTrees(data) {
    const result = []
    data.forEach((item) => {
        let temp = {
            title: t(item.code),
            key: item.id,
        }
        if (item.children && item.children.length) {
            let children = toMenuTrees(item.children)
            temp['children'] = children || []
        }

        result.push(temp)
    })
    return result
}
/**
 * 新建
 */
function handleCreate() {
    showModal({
        type: 'create',
        title: t('pages.system.role.add'),
    })
}

/**
 * 编辑
 */
async function handleEdit(record = {}) {
    showModal({
        type: 'edit',
        title: t('pages.system.role.edit'),
    })

    const { data, success } = await apis.role.getRole(record.id).catch()
    if (!success) {
        message.error(t('component.message.error.save'))
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
