import { type App } from "vue"
import Antd from "ant-design-vue"

export function loadAntdPlus(app: App) {
  /** antd 组件完整引入 */
  app.use(Antd)
}
