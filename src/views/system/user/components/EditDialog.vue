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
                            :label="$t('pages.system.user.form.username')"
                            name="username">
                            <a-input
                                :placeholder="$t('pages.system.user.form.username.placeholder')"
                                v-model:value="formData.username"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.user.form.password')"
                            name="password">
                            <a-input-password
                                v-model:value="formData.password"
                                :placeholder="$t('pages.system.user.form.password.placeholder')" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="12">
                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.user.form.name')"
                            name="name">
                            <a-input
                                :placeholder="$t('pages.system.user.form.name.placeholder')"
                                v-model:value="formData.name"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.user.form.roles')"
                            name="roles">
                            <a-select
                                v-model:value="formData.roles"
                                mode="multiple"
                                style="width: 100%"
                                :placeholder="$t('pages.system.user.form.roles.placeholder')"
                                :options="roles"
                                @change="handleChange"></a-select>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.user.form.phone')"
                            type="tel"
                            name="phone">
                            <a-input
                                :placeholder="$t('pages.system.user.form.phone.placeholder')"
                                type="tel"
                                v-model:value="formData.phone"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            :label="$t('pages.system.user.form.email')"
                            type="email"
                            name="email">
                            <a-input
                                :placeholder="$t('pages.system.user.form.email.placeholder')"
                                type="email"
                                v-model:value="formData.email"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="12">
                    <a-col :span="24">
                        <a-form-item
                            :label="$t('pages.system.user.form.remark')"
                            name="remark">
                            <a-textarea
                                :placeholder="$t('pages.system.user.form.remark.placeholder')"
                                v-model:value="formData.remark"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="12">
                    <a-col :span="24">
                        <a-form-item
                            :label="$t('pages.system.user.form.status')"
                            name="status">
                            <a-radio-group
                                v-model:value="formData.status"
                                :options="[
                                    { label: t('pages.system.user.form.status.activated'), value: 'activated' },
                                    { label: t('pages.system.user.form.status.freezed'), value: 'freezed' },
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
import { useI18n } from 'vue-i18n'
const emit = defineEmits(['ok'])
const { t } = useI18n() // 解构出t方法
const { modal, showModal, hideModal, showLoading, hideLoading } = useModal()
const { formRecord, formData, formRef, formRules, resetForm } = useForm()
const cancelText = ref(t('button.cancel'))
const okText = ref(t('button.confirm'))
const rolesValue = ref([])
const roles = ref([])

formRules.value = {
    name: { required: true, message: t('pages.system.user.form.username.placeholder') },
    username: { required: true, message: t('pages.system.user.form.code.placeholder') },
    status: { required: true, message: t('pages.system.user.form.status') },
    roles: [{ required: true, message: t('pages.system.user.form.roles.placeholder'), trigger: 'change' }],
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
}

/**
 * 新建
 */
function handleCreate() {
    showModal({
        type: 'create',
        title: t('pages.system.user.add'),
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
        title: t('pages.system.user.edit'),
    })
    const { data, success } = await apis.users.getUsers(record.id).catch()
    if (!success) {
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
