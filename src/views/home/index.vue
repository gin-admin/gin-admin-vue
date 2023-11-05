<template>
    <a-row :gutter="16">
        <a-col :lg="24">
            <a-card>
                <a-row
                    class="align-center"
                    type="flex">
                    <p
                        class="display-flex align-items-center"
                        style="background-color: #f6ffec; padding: 10px; box-sizing: border-box; width: 100%">
                        <check-circle-filled class="mr-4-1 color-success" />
                        更加简洁、高效、模块化的 Golang Admin 服务，已经发布。
                    </p>
                </a-row>
            </a-card>

            <a-card
                class="mt-8-2"
                title="欢迎使用">
                <p>
                    gin-admin-cli new -d ~/go/src --name testapp --desc 'A test API service based on golang.' --pkg
                    'github.com/xxx/testapp
                    <copy-outlined
                        style="color: #10a6fa"
                        class="copy-btn"
                        data-clipboard-text=" gin-admin-cli new -d ~/go/src --name testapp --desc 'A test API service based on golang.' --pkg
                    'github.com/xxx/testapp"
                        @click="handleCopy" />
                </p>
            </a-card>

            <a-card
                class="mt-8-2"
                title="快速开始">
                <p>
                    1, gin-admin-cli new -d ~/go/src --name testapp --desc 'A test API service based on golang.' --pkg
                    'github.com/xxx/testapp'

                    <copy-outlined
                        style="color: #10a6fa"
                        class="copy-btn"
                        data-clipboard-text="gin-admin-cli new -d ~/go/src --name testapp --desc 'A test API service based on golang.' --pkg 'github.com/xxx/testapp'"
                        @click="handleCopy" />
                </p>

                <p>
                    2, cd ~/go/src/testapp
                    <copy-outlined
                        style="color: #10a6fa"
                        class="copy-btn"
                        data-clipboard-text="cd ~/go/src/testapp"
                        @click="handleCopy" />
                </p>
                <p>
                    3, make start
                    <copy-outlined
                        style="color: #10a6fa"
                        class="copy-btn"
                        data-clipboard-text="make start"
                        @click="handleCopy" />
                </p>
                <p>Open your browser and visit http://localhost:8040/swagger/index.html</p>
            </a-card>

            <a-card
                class="mt-8-2"
                title="生成结构体">
                <p>
                    gin-admin-cli gen -d . -m CMS -s Category --structs-comment 'Category management'

                    <copy-outlined
                        style="color: #10a6fa"
                        class="copy-btn"
                        data-clipboard-text="gin-admin-cli gen -d . -m CMS -s Category --structs-comment 'Category management'"
                        @click="handleCopy" />
                </p>
            </a-card>
            <a-card
                class="mt-8-2"
                title="删除结构体">
                <p>
                    gin-admin-cli rm -d . -m CMS -s Category
                    <copy-outlined
                        style="color: #10a6fa"
                        class="copy-btn"
                        data-clipboard-text="gin-admin-cli rm -d . -m CMS -s Category"
                        @click="handleCopy" />
                </p>
            </a-card>
        </a-col>
    </a-row>
</template>

<script setup>
import ClipboardJS from 'clipboard'
import { CheckCircleFilled, CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
defineOptions({
    name: 'home',
})
const handleCopy = () => {
    const clipboard = new ClipboardJS('.copy-btn')
    clipboard.on('success', (e) => {
        e.clearSelection()
        message.success('复制成功!')
    })
    clipboard.on('error', () => {
        message.error('复制失败!')
    })
}
</script>

<style lang="less" scoped></style>
