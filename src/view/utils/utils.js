/* eslint-disable */
import XLSX from 'xlsx'
import Fingerprint2 from 'fingerprintjs2'
import store from '@/store'
import Vue from 'vue'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = [ 'has a rest time!~' ]
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {
  }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

// 转换xlsx文件到json
export function XlsxToJSON (file) {
  return new Promise((resolve, reject) => {
    var buf;
    var reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = function (e) {
      buf = XLSX.read(e.target.result, { type: 'binary' })
      let json = XLSX.utils.sheet_to_json(buf.Sheets[buf.SheetNames[0]])
      resolve(json)
    }
    reader.onerror = function (e) {
      reject(e)
    }
  })
}

// 获取系统信息
export function getSysInfo () {
  return navigator.userAgent.toLowerCase()
}

// 获取内网ip
export const findLocalIp = (logInfo = true) => new Promise((resolve, reject) => {
  window.RTCPeerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection

  if (typeof window.RTCPeerConnection === 'undefined') {
    return reject('WebRTC not supported by browser')
  }

  let pc = new RTCPeerConnection()
  let ips = []

  pc.createDataChannel('')
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .catch(err => reject(err))
  pc.onicecandidate = event => {
    if (!event || !event.candidate) {
      // All ICE candidates have been sent.
      if (ips.length === 0) {
        return reject('WebRTC disabled or restricted by browser')
      }

      return resolve(ips[0])
    }

    let parts = event.candidate.candidate.split(' ')
    // let [base, componentId, protocol, priority, ip, port, , type, ...attr] = parts;
    // let component = ['rtp', 'rtpc'];
    let ip = parts[4]

    if (!ips.some(e => e === ip)) {
      ips.push(ip)
    }

    if (!logInfo) {
      return false
    }
  }
})

// 获取浏览器指纹
export function getFinger () {
  return new Promise((resolve) => {
    if (window.requestIdleCallback) {
      requestIdleCallback(function () {
        Fingerprint2.get(function (components) {
          resolve(Fingerprint2.x64hash128(components.map(function (pair) {
            return pair.value
          }).join(), 31))
        })
      })
    } else {
      setTimeout(function () {
        Fingerprint2.get(function (components) {
          resolve(Fingerprint2.x64hash128(components.map(function (pair) {
            return pair.value
          }).join(), 31))
        })
      }, 500)
    }
  })
}

/**
 * 格式化文件大小, 输出成带单位的字符串
 * @param {Number} size 文件大小
 * @param {Number} [pointLength=2] 精确到的小数点数。
 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。
 *    如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
 */
export function formatSize (size = 0, pointLength, units) {
  var unit
  units = units || ['B', 'K', 'M', 'G', 'TB']
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024
  }
  return (unit === 'B' ? size : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
}

/**
 * 自动加密数据
 * */
export function plainEncrypt (obj) {
  let plainList = store.state.permission.encryptPlain
  // 初始化过滤显示
  let keys = Object.keys(obj)
  keys.forEach((v) => {
    obj[`${v}_text`] = (plainList.includes(v) ? plainString(obj[v]) : obj[v])
  })
  return obj
}

function plainString (s) {
  return String(s).replace(/\S/g, '*')
}

/**
 * 数字转中文大写金额
 * */
export function turnCNUpcase (n) {
  var fraction = ['角', '分']
  var digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ]
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  var head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  var s = ''
  var i
  for (i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  var mn
  for (mn = 0; i < unit[0].length && n > 0; mn++) {
    var p = ''
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][mn] + s
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '')
}

/**
 * 数字转汉字
 * */
export function toChinesNum (num) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  let getWan = (temp) => {
    let strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  let overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

// 时间戳转换为时间长度
export function dateDuration (date) {
  const n2str = n => n.toLocaleString()
  // 单位
  const unit = { year: '年', month: '月', day: '天', hour: '小时', minute: '分', second: '秒' }
  const arr = ['year', 'month', 'day', 'hour', 'minute', 'second']
  const second = parseInt(n2str(date % 60), 10)
  const minute = parseInt(n2str(date / 60 % 60), 10)
  const hour = parseInt(n2str(date / 60 / 60 % 24), 10)
  const day = parseInt(n2str(date / 60 / 60 / 24 % 30), 10)
  const month = parseInt(n2str(date / 60 / 60 / 24 % 365 / 30), 10)
  const year = parseInt(n2str(date / 60 / 60 / 24 / 365), 10)
  const obj = { year, month, day, hour, minute, second }
  return arr.filter(v => obj[v] > 0).map(v => obj[v] + unit[v]).join('')
}

// 银行卡号校验
// Description: 银行卡号Luhm校验
// Luhm校验规则：16位银行卡号（19位通用）:
// 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
// 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
// 3.将加法和加上校验位能被 10 整除。
export function luhmCheck (bankno = '') {
  // 返回消息体
  class Msg {
    constructor (status, msg) {
      this.status = status
      this.msg = msg
    }
  }

  // 长度验证
  if (bankno.length < 16 || bankno.length > 19) return new Msg(false, '银行卡号长度必须在16到19之间')
  // 数字验证
  if (!/^\d*$/.exec(bankno)) return new Msg(false, '银行卡号必须全为数字')
  // 开头6位验证
  let strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
  if (strBin.indexOf(bankno.substring(0, 2)) === -1) return new Msg(false, '银行卡号开头6位不符合规范')

  // luhm验证
  let lastNum = bankno.substr(bankno.length - 1, 1)// 取出最后一位（与luhm进行比较）
  let first15Num = bankno.substr(0, bankno.length - 1)// 前15或18位
  let newArr = []
  for (let i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }
  let arrJiShu = [] // 奇数位*2的积 <9
  let arrJiShu2 = [] // 奇数位*2的积 >9
  let arrOuShu = [] // 偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 === 1) { // 奇数位
      if (parseInt(newArr[j]) * 2 < 9) {
        arrJiShu.push(parseInt(newArr[j]) * 2)
      } else {
        arrJiShu2.push(parseInt(newArr[j]) * 2)
      }
    } else { // 偶数位
      arrOuShu.push(newArr[j])
    }
  }
  let jishu_child1 = []// 奇数位*2 >9 的分割之后的数组个位数
  let jishu_child2 = []// 奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }
  let sumJiShu = 0 // 奇数位*2 < 9 的数组之和
  let sumOuShu = 0 // 偶数位数组之和
  let sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal = 0
  for (let m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }
  for (let n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }
  for (let p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  // 计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)
  // 计算Luhm值
  let k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
  let luhm = 10 - k
  if (lastNum === luhm) {
    return new Msg(true, 'Luhm验证通过')
  } else {
    return new Msg(false, '银行卡号必须符合Luhm校验')
  }
}

// json解析
export function jsonParse (s, def = '') {
  try {
    return JSON.parse(s)
  } catch (e) {
    return def
  }
}

/**
 * 判断是不是json
 */
export function isJSON (str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

// 字符系统
export class LetterSystem {
  constructor (s) {
    this.str = s
    this.val = this.parse(s)
  }
  parse (s) {
    return parseInt(s || 'A', 36)
  }
  getVal (val = this.val) {
    return val.toString(36).toUpperCase()
  }
  getNext () {
    let str = this.str
    let arr = str.split('').reverse().map(v => v.charCodeAt())
    let index = 0; let lock = true
    while (lock) {
      if (arr[index] < 90) {
        arr[index] += 1
        lock = false
      } else if (index < str.length + 1) {
        arr[index] = 65
        index++
      } else {
        lock = false
      }
    }
    return arr.reverse().map(v => String.fromCharCode(v)).join('')
  }
}

// 登录后自动创建iframe同步
export function createLoginIframe (url) {
  const i = document.createElement('iframe')
  i.src = url
  i.style.display = 'none'
  i.onload = function () {
    console.log('iframe loaded', url)
    setTimeout(function () {
      i.remove()
    }, 9)
  }
  document.body.appendChild(i)
}
