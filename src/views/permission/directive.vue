<script lang="ts" setup>
import { ref } from "vue"
import { checkPermission } from "@/utils/permission" // checkPermission 权限判断函数
import SwitchRoles from "./components/SwitchRoles.vue"

/** key 是为了能每次切换权限的时候重新初始化指令 */
const key = ref(1)
const handleRolesChange = () => {
  key.value++
}
</script>

<template>
  <div class="app-container">
    <SwitchRoles @change="handleRolesChange" />
    <div :key="key" class="margin-top">
      <div>
        <span v-permission="['admin']" class="permission-alert">
          只有
          <a-tag>admin</a-tag>可以看见这个
        </span>
        <a-tag v-permission="['admin']" class="permission-code" type="info" size="large">
          v-permission="['admin']"
        </a-tag>
      </div>
      <div>
        <span v-permission="['editor']" class="permission-alert">
          只有
          <a-tag>editor</a-tag>可以看见这个
        </span>
        <a-tag v-permission="['editor']" class="permission-code" type="info" size="large">
          v-permission="['editor']"
        </a-tag>
      </div>
      <div>
        <span v-permission="['admin', 'editor']" class="permission-alert">
          两者
          <a-tag>admin</a-tag>和 <a-tag>editor</a-tag>都可以看见这个
        </span>
        <a-tag v-permission="['admin', 'editor']" class="permission-code" type="info" size="large">
          v-permission="['admin', 'editor']"
        </a-tag>
      </div>
    </div>
    <div :key="'checkPermission' + key" class="margin-top">
      <a-tag type="info" size="large">
        在某些情况下，不适合使用 v-permission。例如: Element Plus 的 a-tab-pane 或 a-table-column 以及其它动态渲染 Dom
        的场景。你只能通过手动设置 v-if 来实现。
      </a-tag>
      <a-tabs type="border-card" class="margin-top">
        <a-tab-pane v-if="checkPermission(['admin'])" label="admin">
          admin 可以看见这个
          <a-tag class="permission-code" type="info"> v-if="checkPermission(['admin'])" </a-tag>
        </a-tab-pane>
        <a-tab-pane v-if="checkPermission(['editor'])" label="editor">
          editor 可以看见这个
          <a-tag class="permission-code" type="info"> v-if="checkPermission(['editor'])" </a-tag>
        </a-tab-pane>
        <a-tab-pane v-if="checkPermission(['admin', 'editor'])" label="admin 和 editor">
          两者 admin 和 editor 都可以看见这个
          <a-tag class="permission-code" type="info"> v-if="checkPermission(['admin', 'editor'])" </a-tag>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
.permission-alert {
  width: 320px;
  margin-top: 15px;
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}

.permission-code {
  margin-left: 15px;
}

.margin-top {
  margin-top: 30px;
}
</style>
