import axios from 'axios'
import { getToken } from '../../libs/util'
import Qs from 'qs'
import crypto from './crypto'

// 创建 axios 实例
const scope = {
  development: 'RJGFvQNEUbPi0PsP',
  production: 'zANQH6cA9wDiDtkozV'
}

// 排除的请求接口
const queueExcludes = [
  '/api/^'
].map(v => process.env.VUE_APP_API_BASE_URL + v)

export function get (url, cached) {
  return (params, query = '') => service.get(url + query, { params, cached })
}

export function post (url) {
  return data => service.post(url, data)
}

export function put (url) {
  return params => service.put(url, params)
}

export function del (url) {
  return params => service.delete(url, { params })
}

function filter (data = {}) {
  let nData = {}
  let list = [null, undefined] // NaN
  for (let key in data) {
    if (!list.includes(data[key]) && !judgeNaN(data[key])) nData[key] = data[key]
  }
  return nData
}

// 判断是不是NaN
function judgeNaN (n) {
  return typeof n === 'number' && isNaN(n)
}

const options = {
  timeout: 100000,
  paramsSerializer (params) {
    return Qs.stringify(params, { arrayFormat: 'indices' })
  },
  transformRequest: [
    function (data, headers) {
      // 文件上传
      if (data instanceof FormData) {
        return data
      } else {
        return Qs.stringify(data, { arrayFormat: 'indices' })
      }
    }
  ],
  adapter: null
}

function err (e) {
  if (e && e.response) {
  }
  return Promise.reject(e)
}

const service = axios.create(options)
const CancelToken = axios.CancelToken
window._rqueue = []
export default service
const encryptKeys = ['url', 'method']

service.interceptors.request.use(config => {
  // 请求地址不存在http开头时自动拼接BASEURL
  if (!new RegExp(/^http/).test(config.url)) {
    config.url = process.env.VUE_APP_API_BASE_URL + config.url
  }
  // 添加其他配置
  config.params = config.params || {}
  config.params.scope = scope[process.env.NODE_ENV]
  // config.params.lang = "zh_CN"
  config.headers['project-token'] = getToken()
  // 参数过滤
  config.params = filter(config.params)
  // 上传文件开放超时
  if (config.data instanceof FormData) {
    config.timeout = 0
  }
  let key = crypto.getEncryptByKeys(config, encryptKeys)
  if (!queueExcludes.includes(config.url)) {
    // 防止重复请求
    let index = window._rqueue.findIndex(v => v.key === key)
    if (index !== -1) {
      console.log(`%c${window._rqueue[index].url} 请求未完成，请求任务队列取消已存在请求`, 'color: red')
      window._rqueue[index].cancel(window._rqueue[index].url + '请求取消')
      // 取消自动删除
      let result = window._rqueue.splice(index, 1)
      console.log('取消，删除请求任务队列', window._rqueue.length, result[0].url)
    }
    // 添加请求取消
    config.cancelToken = new CancelToken(function (c) {
      let item = { key, url: config.url, cancel: c }
      window._rqueue.push(item)
      console.log('添加请求任务队列', window._rqueue.length, item.url)
    })
  }
  return config
}, err)
