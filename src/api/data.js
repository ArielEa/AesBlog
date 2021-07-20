import axios from '@/libs/api.request'

export const getTableData = () => {
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
}

export const uploadImg = formData => {
}

export const getOrgData = () => {
}

export const getTreeSelectData = () => {
}
