/**
 * @name Action
 * @description 权限
 * @example v-action:action || v-action="'action'" || v-action="['action1', 'action2']"
 * @type {{mounted: actionDirective.mounted}}
 */

import router from '@/router'

const action = {
    mounted: (el, binding) => {
        // const route = router.currentRoute.value
        // const actions = route?.meta?.actions ?? []
        // const actionName = binding.arg || binding.value
        //
        // if (route?.meta?.actions.includes('*')) return
        //
        // if (!actionName) return
        // if (Array.isArray(actionName)) {
        //     // 多个权限
        //     if (!actions.some((value) => actionName.includes(value))) {
        //         ;(el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none')
        //     }
        // } else {
        //     // 一个权限，完全匹配
        //     if (!actions.includes(actionName)) {
        //         ;(el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none')
        //     }
        // }
        const { value: elActions } = binding
        const route = router.currentRoute.value
        const currentActions = route?.meta?.actions ?? []
        const actions = typeof value === 'string' ? elActions.split() : elActions

        if (currentActions.includes('*')) return

        if (!currentActions.some((action) => actions.includes(action))) {
            el.remove() || (el.style.display = 'none')
        }
    },
}
/**
 * 校验权限
 * @param {string | array} actions
 */
const checkAction = (actions = '') => {
    const route = router.currentRoute.value
    const currentActions = route?.meta?.actions ?? []
    actions = typeof actions === 'string' ? actions.split() : actions

    if (currentActions.includes('*')) {
        return true
    }

    if (!currentActions.some((action) => actions.includes(action))) {
        return false
    }

    return true
}

export const setupActionDirective = (app) => {
    app.directive('action', action)
    app.config.globalProperties.$checkAction = checkAction
    return app
}
export default setupActionDirective
