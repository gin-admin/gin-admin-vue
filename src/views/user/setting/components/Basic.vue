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
                    name="name"
                    label="昵称">
                    <a-input v-model:value="formData.name"></a-input>
                </a-form-item>
                <a-form-item
                    label="邮箱"
                    name="email">
                    <a-input v-model:value="formData.email"></a-input>
                </a-form-item>
                <a-form-item
                    name="phone"
                    label="联系电话">
                    <a-input v-model:value="formData.phone"></a-input>
                </a-form-item>

                <a-form-item
                    label="个人简介"
                    name="remark">
                    <a-textarea v-model:value="formData.remark"></a-textarea>
                </a-form-item>

                <a-form-item>
                    <a-button
                        @click="handleOk"
                        type="primary"
                        >更新资料
                    </a-button>
                </a-form-item>
            </a-form>
        </a-col>
        <!--        <a-col class="align-center">-->
        <!--            <div>-->
        <!--                <a-avatar-->
        <!--                    src="http://cdn.xuanyunet.com/images/avatar.jpg"-->
        <!--                    :size="144"></a-avatar>-->
        <!--            </div>-->
        <!--            <div class="mt-8-2">-->
        <!--                <a-upload :show-upload-list="false">-->
        <!--                    <a-button>-->
        <!--                        <template #icon>-->
        <!--                            <upload-outlined></upload-outlined>-->
        <!--                        </template>-->
        <!--                        上传头像-->
        <!--                    </a-button>-->
        <!--                </a-upload>-->
        <!--            </div>-->
        <!--        </a-col>-->
    </a-row>
</template>

<script setup>
import apis from '@/apis'

defineOptions({
    name: 'Basic',
})
import { config } from '@/config'
import { useForm } from '@/hooks'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { formRef, formData, formRules } = useForm()

getUserInfo()

/**
 * 获取用户信息
 * @returns {Promise<void>}
 */
async function getUserInfo() {
    const { data } = await apis.user.getUserDetail().catch((err) => {
        console.log(err)
    })
    formData.value = data
}

/**
 * 提交表单
 */
function handleOk() {
    formRef.value.validateFields().then(async (values) => {
        const params = {
            ...values,
        }
        const { success } = await apis.user.updateUser(formData.value.id, params).catch((err) => {
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
