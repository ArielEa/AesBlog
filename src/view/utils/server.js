import axios from 'axios'

export function get (url, cached) {
  return (params, query = '') => axios.get(url + query, { params, cached })
}

export function post (url) {
  return data => axios.post(url, data)
}

export function put (url) {
  return params => axios.put(url, params)
}

export function del (url) {
  return params => axios.delete(url, { params })
}
