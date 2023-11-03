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
                            label="用户名"
                            name="username">
                            <a-input v-model:value="formData.username"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="密码"
                            name="password">
                            <a-input-password
                                v-model:value="formData.password"
                                placeholder="请输入密码" />
                        </a-form-item>
                    </a-col>
                </a-row>
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
                            label="所属角色"
                            name="roles">
                            <a-select
                                v-model:value="formData.roles"
                                mode="multiple"
                                style="width: 100%"
                                placeholder="Please select"
                                :options="roles"
                                @change="handleChange"></a-select>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
                    <a-col :span="12">
                        <a-form-item
                            label="手机号"
                            type="tel"
                            name="phone">
                            <a-input
                                type="tel"
                                v-model:value="formData.phone"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="邮箱"
                            type="email"
                            name="email">
                            <a-input
                                type="email"
                                v-model:value="formData.email"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
                    <a-col :span="24">
                        <a-form-item
                            label="备注"
                            name="remark">
                            <a-textarea v-model:value="formData.remark"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="12">
                    <a-col :span="24">
                        <a-form-item
                            label="状态"
                            name="status">
                            <a-radio-group
                                v-model:value="formData.status"
                                :options="[
                                    { label: '启用', value: 'activated' },
                                    { label: '禁用', value: 'freezed' },
                                ]"></a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
    </a-modal>
</template>

<script setup>
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'
import { config } from '@/config'
import apis from '@/apis'
import { useForm, useModal } from '@/hooks'
import { message } from 'ant-design-vue'

const emit = defineEmits(['ok'])

const { modal, showModal, hideModal, showLoading, hideLoading } = useModal()
const { formRecord, formData, formRef, formRules, resetForm } = useForm()
const cancelText = ref('取消')
const rolesValue = ref([])
const roles = ref([])

formRules.value = {
    name: { required: true, message: '请输入名称' },
    username: { required: true, message: '请输入编码' },
    status: { required: true, message: '请选择状态' },
    roles: [{ required: true, message: '请选择所属角色', trigger: 'change' }],
}

/**
 * 请求角色
 */
getRole()

/**
 * select 选择框
 */
const handleChange = (value) => {
    rolesValue.value = value
    console.log(`selected ${rolesValue.value}`)
}

/**
 * 新建
 */
function handleCreate() {
    showModal({
        type: 'create',
        title: '新建用户',
    })
}
async function getRole() {
    const { success, data } = await apis.role.getRoleList().catch(() => {
        throw new Error()
    })
    if (!success) {
        return message.error('当前角色信息错误')
    }
    let roleArr = []
    if (data.length) {
        data.forEach((item) => {
            roleArr.push({
                label: item.name,
                value: item.id,
            })
        })
    }
    roles.value = roleArr
}
/**
 * 编辑
 */
async function handleEdit(record = {}) {
    showModal({
        type: 'edit',
        title: '编辑用户',
    })
    const { data, success } = await apis.users.getUsers(record.id).catch()
    if (!success) {
        message.error('当前数据不存在')
        hideModal()
        return
    }
    let roles = []
    if (data.roles) {
        roles = formatArr(data.roles, 'edit')
    }

    data.roles = roles
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
            try {
                showLoading()

                const params = {
                    ...values,
                    roles: formatArr(rolesValue.value),
                }
                let result = null
                switch (modal.value.type) {
                    case 'create':
                        result = await apis.users.createUsers(params).catch(() => {
                            throw new Error()
                        })
                        break
                    case 'edit':
                        result = await apis.users.updateUsers(formData.value.id, params).catch(() => {
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
 * 对权限组 过数据格式
 */
function formatArr(data, type = '') {
    const rolesArr = []
    data.forEach((item) => {
        roles.value.forEach((r) => {
            if (type === 'edit') {
                if (item.role_id === r.value) {
                    rolesArr.push({
                        value: item.role_id,
                        label: r.label,
                    })
                    return
                }
            } else if (r.value === item) {
                rolesArr.push({
                    role_id: item,
                    role_name: r.label,
                })
                return
            }
        })
    })
    return rolesArr
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
