import { Rule } from "ant-design-vue/lib/form"
export const isExternal = (path: string) => {
  const reg = /^(https?:|mailto:|tel:)/
  return reg.test(path)
}

export const isArray = (arg: any) => {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]"
  }
  return Array.isArray(arg)
}

export function isString(str: any) {
  if (typeof str === "string" || str instanceof String) {
    return true
  }
  return false
}

export const isValidURL = (url: string) => {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export const checkAge = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject("Please input the age")
  }
  if (!Number.isInteger(value)) {
    return Promise.reject("Please input digits")
  } else {
    if (value < 18) {
      return Promise.reject("Age must be greater than 18")
    } else {
      return Promise.resolve()
    }
  }
}
