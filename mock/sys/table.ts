import { MockMethod } from "vite-plugin-mock"
import { resultSuccess } from "../_util"
import { mock } from "mockjs"

const demoList = (() => {
  const result: any[] = []
  for (let index = 0; index < 200; index++) {
    result.push({
      key: "@id",
      name: "@cname",
      age: "@integer(10-100)",
      address: "@city",
      tags: mock('@shuffle(["nice", "developer"])')
    })
  }
  return result
})()

export default [
  {
    url: "/mock-api/table",
    timeout: 100,
    method: "get",
    response: ({ query }: any) => {
      const { currentPage = 1, size = 20 } = query
      const total = demoList.length
      const list = demoList.slice(0, size)
      return resultSuccess({
        list,
        total,
        currentPage,
        size
      })
    }
  }
] as MockMethod[]
