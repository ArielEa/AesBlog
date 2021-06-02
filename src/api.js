import axios from 'axios'
import qs from 'qs'

// 设置默认请求方式，指定Content-Type
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const instance = axios.create({
  baseURL: '/',
  timeout: 3000
})

// vue全局扩展方法接口
function install (Vue) {
  Vue.prototype.$ajax = {
    post,
    get
  }
}

//  post请求方法，并根据不同请求类型传入指定的 headers
async function post (url, opts = {}, headers) {
  var result = {}
  try {
    result = await instance.post(url, qs.stringify(opts), headers)
  } catch (e) {
    console.log(e)
    result = e.response || {
      data: null
    }
  }
  return result.data
}

async function get (url, type, opts = {}) {
  var result = {}

  try {
    result = await instance.get(url, opts)
  } catch (e) {
    console.log(e)
    result = e.response || {
      data: null
    }
  }
  return result.data
}

export default {
  install
}
