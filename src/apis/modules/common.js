import request from '@/utils/request'

// 获取地区
export const getRegion = (params) => request.basic.get('/region', params)

// 获取 验证码ID
export const getCaptcha = (params) => request.basic.get('/api/v1/captcha/id', params)
