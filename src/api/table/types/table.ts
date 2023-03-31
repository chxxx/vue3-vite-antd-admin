export interface ICreateTableRequestData {
  name: string
  age: number
}

export interface IUpdateTableRequestData {
  // id: string
  // username: string
  // password?: string
  name: string
  age: number
}

export interface IGetTableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  name?: string
  /** 查询参数：手机号 */
  age?: number
}

// export interface IGetTableData {
//   createTime: string
//   email: string
//   id: string
//   phone: string
//   roles: string
//   status: boolean
//   username: string
// }
export interface IGetTableData {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}
export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
