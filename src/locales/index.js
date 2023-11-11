import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'

import { createI18n } from 'vue-i18n'
import storage from '@/utils/storage'
import { config } from '@/config'

const messages = {
    'en-us': {
        ...enUS,
    },
    'zh-ch': {
        ...zhCN,
    },
}
const i18n = createI18n({
    locale: storage.local.getItem(config('storage.lang')) || 'zh-ch',
    legacy: false, // composition API
    messages,
})

export default i18n
