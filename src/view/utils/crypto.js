import { jsonParse } from './utils'
import _ from 'lodash';
import CryptoJS from 'crypto-js';
// 加密秘钥、是否开启加密
const key = 'project-api', status = false;
// 获取对应对象的固定字段的加密
function getEncryptValues(data, keys){
  let obj = new Object();
  for(let key in data){
    if(keys.includes(key)){
      obj[key] = data[key];
    }
  }
  return obj;
}
export default {
  // 加密
  encrypt(data){
    // 未开启
    if(!status)return data;
    let str = JSON.stringify(data);
    let result = CryptoJS.AES.encrypt(str, key).toString();
    return result;
  },
  // 解密
  decrypt(ciphertext){
    // 未开启
    if(!status)return ciphertext;
    let bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    let result = bytes.toString(CryptoJS.enc.Utf8);
    return jsonParse(result);
  },
  md5(str){
    return CryptoJS.MD5(str).toString();
  },
  // md5加密
  getEncryptByKeys(data, keys){
    let str = JSON.stringify(getEncryptValues(data, keys));
    let result = CryptoJS.MD5(str).toString();
    return result;
  }
}
