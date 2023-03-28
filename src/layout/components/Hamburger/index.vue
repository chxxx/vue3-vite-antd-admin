<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue"

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: "toggle-click"): void
}>()

const toggleClick = () => {
  emit("toggle-click")
}
</script>

<template>
  <div @click="toggleClick">
    <menu-fold-outlined v-if="props.isActive" />
    <menu-unfold-outlined v-else />
  </div>
</template>

<style lang="less" scoped>
.icon {
  vertical-align: middle;
}
</style>
