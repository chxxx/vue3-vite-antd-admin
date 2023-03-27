import { type App } from "vue"
import * as AntdPlusIconsVue from "@ant-design/icons-vue"

export function loadAntdPlusIcon(app: App) {
  /** 注册所有 Antd Icon */
  for (const [key, component] of Object.entries(AntdPlusIconsVue)) {
    app.component(key, component)
  }
}
