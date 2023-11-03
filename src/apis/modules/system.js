import request from '@/utils/request'

// 获取日志列表
export const getLoggers = (params) => request.basic.get('/api/v1/loggers', params)
