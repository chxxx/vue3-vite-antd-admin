<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/modules/app"
import { usePermissionStore } from "@/store/modules/permission"
import { useSettingsStore } from "@/store/modules/settings"
import SidebarItem from "./SidebarItem.vue"
import SidebarLogo from "./SidebarLogo.vue"
// import { getCssVariableValue } from "@/utils"

// const v3SidebarMenuBgColor = getCssVariableValue("--v3-sidebar-menu-bg-color")
// const v3SidebarMenuTextColor = getCssVariableValue("--v3-sidebar-menu-text-color")
// const v3SidebarMenuActiveTextColor = getCssVariableValue("--v3-sidebar-menu-active-text-color")

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const { showSidebarLogo } = storeToRefs(settingsStore)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const isCollapse = computed(() => {
  return !appStore.sidebar.opened
})
</script>

<template>
  <div :class="{ 'has-logo': showSidebarLogo }">
    <SidebarLogo v-if="showSidebarLogo" :collapse="isCollapse" />
    <a-menu
      :selectedKeys="[activeMenu]"
      :inlineCollapsed="isCollapse"
      :unique-opened="true"
      :multiple="false"
      mode="inline"
      theme="dark"
    >
      <SidebarItem
        v-for="route in permissionStore.routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
        :is-collapse="isCollapse"
      />
    </a-menu>
  </div>
</template>

<style lang="less" scoped>
.tip-line() {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}

.ant-menu {
  border: none;
  // min-height: 100%;
  height: calc(100vh - var(--v3-header-height));
  width: 100% !important;
  overflow-y: auto;
}

:deep(.a-menu-item),
:deep(.a-sub-menu__title),
:deep(.a-sub-menu .a-menu-item) {
  height: var(--v3-sidebar-menu-item-height);
  line-height: var(--v3-sidebar-menu-item-height);
  &.is-active,
  &:hover {
    background-color: var(--v3-sidebar-menu-hover-bg-color);
  }
  display: block;
  * {
    vertical-align: middle;
  }
}

:deep(.a-menu-item) {
  &.is-active {
    .tip-line();
  }
}

.a-menu--collapse {
  :deep(.a-sub-menu) {
    &.is-active {
      .a-sub-menu__title {
        color: var(--v3-sidebar-menu-active-text-color) !important;
        .tip-line();
      }
    }
  }
}
</style>
