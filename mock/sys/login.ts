import { MockMethod } from "vite-plugin-mock"
import { resultSuccess } from "../_util"

export default [
  {
    url: "/mock-api/users/login",
    method: "post",
    response: () => {
      const info = {
        token: "token-admin"
      }
      return resultSuccess(info)
    }
  }
] as MockMethod[]
