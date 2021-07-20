import { getParams } from '@/libs/util'
import axios from '../libs/api.request'

const USER_MAP = {
  // super_admin: {
  //   name: 'super_admin',
  //   user_id: '1',
  //   access: ['super_admin123', 'admin'],
  //   token: 'super_admin',
  //   avatar: ''
  // },
  // admin: {
  //   name: 'admin',
  //   user_id: '2',
  //   access: ['admin'],
  //   token: 'admin',
  //   avatar: ''
  // }
  // customer: {
  //   name: 'customer',
  //   user_id: '3'
  // }
}

/**
 * 设置登录信息
 * @param req
 * @returns {{token}}
 */
export const login = req => {
  req = JSON.parse(req.body)
  // return { token: USER_MAP[req.userName].token }
}

export const saveData = (condition) => {
  return axios.request({
    url: '/api/login/login_in',
    condition,
    method: 'get'
  })
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  console.log(3)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}
