<template>
    <a-row
        type="flex"
        :gutter="48">
        <a-col flex="0 0 480px">
            <a-form
                ref="formRef"
                :rules="formRules"
                :model="formData"
                layout="vertical">
                <a-form-item
                    name="old_password"
                    label="旧密码">
                    <a-input-password
                        v-model:value="formData.old_password"
                        size="large"
                        type="password">
                        <template #prefix>
                            <lock-outlined></lock-outlined>
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item
                    label="新密码"
                    name="new_password">
                    <a-input-password
                        v-model:value="formData.new_password"
                        size="large"
                        type="password">
                        <template #prefix>
                            <lock-outlined></lock-outlined>
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item
                    name="new_passwords"
                    label="确认新密码">
                    <a-input-password
                        v-model:value="formData.new_passwords"
                        size="large"
                        type="password">
                        <template #prefix>
                            <lock-outlined></lock-outlined>
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-button
                        @click="handleOk"
                        type="primary"
                        >更新密码
                    </a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import apis from '@/apis'

defineOptions({
    name: 'Safe',
})
import { config } from '@/config'
import { useForm } from '@/hooks'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { formRef, formData, formRules } = useForm()
import { LockOutlined } from '@ant-design/icons-vue'

/**
 * 提交表单
 */
function handleOk() {
    formRef.value.validateFields().then(async (values) => {
        const params = {
            old_password: values.old_password,
            new_password: values.new_password,
        }
        if (values.new_passwords !== params.new_password) {
            return message.error('两次密码不一致')
        }

        const { success } = await apis.user.updatePassword(params.old_password, params).catch((err) => {
            console.log(err)
        })
        if (config('http.code.success') === success) {
            message.success('修改成功')
            setTimeout(() => {
                router.back()
            }, 1500)
        }
    })
}

// updateUser
</script>

<style lang="less" scoped></style>
