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
                    :label="$t('app.settings.basic.nickname')">
                    <a-input
                        :placeholder="$t('app.settings.basic.nickname-message')"
                        v-model:value="formData.name"></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('app.settings.basic.email')"
                    name="email">
                    <a-input
                        :placeholder="$t('app.settings.basic.email-message')"
                        v-model:value="formData.email"></a-input>
                </a-form-item>
                <a-form-item
                    name="phone"
                    :label="$t('app.settings.basic.phone')">
                    <a-input
                        :placeholder="$t('app.settings.basic.phone-message')"
                        v-model:value="formData.phone"></a-input>
                </a-form-item>

                <a-form-item
                    :label="$t('app.settings.basic.profile')"
                    name="remark">
                    <a-textarea
                        :placeholder="$t('app.settings.basic.profile-message')"
                        v-model:value="formData.remark"></a-textarea>
                </a-form-item>

                <a-form-item>
                    <a-button
                        @click="handleOk"
                        type="primary"
                        >{{ $t('app.settings.basic.update') }}
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
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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
            message.success(t('component.message.success.save'))
            setTimeout(() => {
                router.back()
            }, 1500)
        }
    })
}

// updateUser
</script>

<style lang="less" scoped></style>
