import {
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { loginIn } from '../../view/api/base'
import { Message } from 'iview'
import { getSysInfo, findLocalIp, getFinger } from '../../view/utils/utils'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // login in
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        initUserAgent().then(initVV => {
          // ??????????????????
          let condition = {
            clientDetail: initVV.client_detail, // ???????????????
            clientNo: initVV.client_no, // ?????????
            internalIp: initVV.internal_ip // ????????????IP
          }
          loginIn({
            username: userName,
            password: password,
            fingerprint: condition
          }).then(res => {
            const data = res.data.userInfo
            if (data === undefined) {
              return Message.error('Error!:' + res.data.SubInfo.SubMessage)
            }
            commit('setToken', data.token)
            Message.success('Login Successfully!')
            resolve()
          }).catch(err => {
            reject(err)
          })
        }).catch(e => {
          console.log(e)
        })
      })
    },
    // login out
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // ???????????????????????????????????????????????????????????????????????????????????????????????????logout????????????
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // Obtaining user information
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          const data = state
          commit('setAvatar', data.avatar)
          commit('setUserName', data.name)
          commit('setUserId', data.user_id)
          commit('setAccess', data.access)
          commit('setHasGetInfo', true)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    },
    // ???????????????????????????????????????????????????????????????????????????????????????
    getUnreadMessageCount ({ state, commit }) {
      // ??????????????????
    },
    // ????????????????????????????????????????????????????????????????????????
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // ??????????????????????????????id????????????
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // ????????????????????????????????????
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // ????????????????????????????????????
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // ??????????????????????????????????????????
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

async function initUserAgent () {
  let agent = {
    client_detail: getSysInfo()
  }
  try {
    agent.internal_ip = await findLocalIp()
    agent.client_no = await getFinger()
  } catch (e) {
    console.warn('???????????????????????????')
  }
  return agent
}
