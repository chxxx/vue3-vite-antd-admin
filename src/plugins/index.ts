import { type App } from "vue"
import { loadAntdPlus } from "./antd"
import { loadAntdPlusIcon } from "./antd-icon"
import { loadVxeTable } from "./vxe-table"

export function loadPlugins(app: App) {
  loadAntdPlus(app)
  loadAntdPlusIcon(app)
  loadVxeTable(app)
}
