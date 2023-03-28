import { type App } from "vue"
import { loadAntdPlus } from "./antd"
import { loadAntdPlusIcon } from "./antd-icon"

export function loadPlugins(app: App) {
  loadAntdPlus(app)
  loadAntdPlusIcon(app)
}
