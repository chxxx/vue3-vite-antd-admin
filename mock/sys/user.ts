import { MockMethod } from "vite-plugin-mock"
import { resultSuccess } from "../_util"

export function createFakeUserList() {
  return [
    {
      userId: "1",
      username: "vben",
      realName: "Vben Admin",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640",
      desc: "manager",
      password: "123456",
      token: "fakeToken1",
      homePath: "/dashboard/analysis",
      roles: [
        {
          roleName: "Super Admin",
          value: "super"
        }
      ]
    },
    {
      userId: "2",
      username: "test",
      password: "123456",
      realName: "test user",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640",
      desc: "tester",
      token: "fakeToken2",
      homePath: "/dashboard/workbench",
      roles: [
        {
          roleName: "Tester",
          value: "test"
        }
      ]
    }
  ]
}

export default [
  {
    url: "/mock-api/users/info",
    method: "get",
    response: () => {
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      // const checkUser = createFakeUserList().find((item) => item.userId === '2')
      // if (!checkUser) {
      //   return resultError('The corresponding user information was not obtained!')
      // }
      const info = {
        username: "admin",
        roles: ["admin"],
        mock: true
      }
      return resultSuccess(info)
    }
  }
] as MockMethod[]
