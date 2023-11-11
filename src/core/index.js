import antd from 'ant-design-vue'
import component from '@/components'
import i18n from '@/locales'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupException } from './exception'
import { setupDirective } from '@/directives'

import './permission'

import 'ant-design-vue/dist/reset.css'
import '@/styles/index.less'

export const useCore = (app) => {
    app.use(antd)
    app.use(component)
    app.use(i18n)
    setupException(app)
    setupStore(app)
    setupRouter(app)
    setupDirective(app)
}
