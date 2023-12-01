interface IBrowserReg {
  [Chrome: string]: RegExp
  IE: RegExp
  Firefox: RegExp
  Opera: RegExp
  Safari: RegExp
  '360': RegExp
  QQBrowswe: RegExp
}
interface IDeviceReg {
  // [iPhone: string]: RegExp
  // Android: RegExp
  // iPad: RegExp
  Windows: RegExp
  Mac: RegExp
  Linux: RegExp
}

const browserReg: IBrowserReg = {
  Chrome: /Chrome/,
  IE: /MSIE/,
  Firefox: /Firefox/,
  Opera: /Presto/,
  Safari: /Version\/([\d.]+).*Safari/,
  '360': /360SE/,
  QQBrowswe: /QQ/
}
const deviceReg: IDeviceReg = {
  // iPhone: /iPhone/,
  // iPad: /iPad/,
  // Android: /Android/,
  Windows: /Windows/,
  Mac: /Macintosh/,
  Linux: /Linux/
}
interface UserAgentObj {
  sourceStr: string
  browserName: string // 浏览器名称
  browserVersion: string // 浏览器版本
  osName: string // 操作系统名称
  osVersion: string // 操作系统版本
  deviceName: string // 设备名称
  isMobile: number //是否移动设备
}

export const useUserAgent = (): UserAgentObj => {
  const userAgentStr: string = navigator.userAgent
  const userAgentObj: UserAgentObj = {
    sourceStr: userAgentStr,
    browserName: '', // 浏览器名称
    browserVersion: '', // 浏览器版本
    osName: '', // 操作系统名称
    osVersion: '', // 操作系统版本
    deviceName: '', // 设备名称
    isMobile: 0 //是否移动设备 1：是，0：否
  }
  for (const key in browserReg) {
    if (browserReg[key].test(userAgentStr)) {
      userAgentObj.browserName = key
      if (key === 'Chrome') {
        userAgentObj.browserVersion = userAgentStr
          .split('Chrome/')[1]
          .split(' ')[0]
      } else if (key === 'IE') {
        userAgentObj.browserVersion = userAgentStr
          .split('MSIE ')[1]
          .split(' ')[1]
      } else if (key === 'Firefox') {
        userAgentObj.browserVersion = userAgentStr.split('Firefox/')[1]
      } else if (key === 'Opera') {
        userAgentObj.browserVersion = userAgentStr.split('Version/')[1]
      } else if (key === 'Safari') {
        userAgentObj.browserVersion = userAgentStr
          .split('Version/')[1]
          .split(' ')[0]
      } else if (key === '360') {
        userAgentObj.browserVersion = ''
      } else if (key === 'QQBrowswe') {
        userAgentObj.browserVersion = userAgentStr
          .split('Version/')[1]
          .split(' ')[0]
      }
    }
  }

  for (const key in deviceReg) {
    //@ts-ignore

    if (deviceReg[key].test(userAgentStr)) {
      userAgentObj.osName = key
      if (key === 'Windows') {
        userAgentObj.osVersion = userAgentStr
          .split('Windows NT ')[1]
          .split(';')[0]
        userAgentObj.isMobile = 0
      } else if (key === 'Mac') {
        userAgentObj.osVersion = userAgentStr
          .split('Mac OS X ')[1]
          .split(')')[0]
        userAgentObj.isMobile = 0
      } else if (key === 'Linux') {
        userAgentObj.osVersion = userAgentStr.split('Linux ')[1].split(')')[0]
        userAgentObj.isMobile = 0
      } else if (key === 'iPhone') {
        userAgentObj.osVersion = userAgentStr
          .split('iPhone OS ')[1]
          .split(' ')[0]
        userAgentObj.isMobile = 1
      } else if (key === 'iPad') {
        userAgentObj.osVersion = userAgentStr
          .split('iPad; CPU OS ')[1]
          .split(' ')[0]
        userAgentObj.isMobile = 1
      } else if (key === 'Android') {
        userAgentObj.osVersion = userAgentStr.split('Android ')[1].split(';')[0]
        userAgentObj.deviceName = userAgentStr
          .split('(Linux; Android ')[1]
          .split('; ')[1]
          .split(' Build')[0]
        userAgentObj.isMobile = 1
      }
    }
  }

  return userAgentObj
}
