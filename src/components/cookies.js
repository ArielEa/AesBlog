// 设置cookie
// export function setCookie ((_keyname, _value, _live) {
export function setCookie (_keyname, _value) {
  // let d = new Date();
  // d.setDate(d.getDate()+_live);
  // document.cookie = _keyname+"="+_value+";expires="+d.toGMTString();
  document.cookie = _keyname + '=' + _value
}
// 获取cookie
export function getCookie (_keyname) {
  if (document.cookie.length > 0) {
    let startCookie = document.cookie.indexOf(_keyname + '=')

    if (startCookie !== -1) {
      startCookie = startCookie + _keyname.length + 1

      let endCookie = document.cookie.indexOf(';', startCookie)

      if (endCookie === -1) {
        endCookie = document.cookie.length
      }
      return unescape(document.cookie.substring(startCookie, endCookie))
    }
  }
}

/* remove cookie */
export function delCookie (_keyname) {
  setCookie(_keyname, '', -1)
}
