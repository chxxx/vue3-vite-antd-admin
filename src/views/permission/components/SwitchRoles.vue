<script lang="ts" setup>
import { ref, watch } from "vue"
import { useUserStore } from "@/store/modules/user"

const emit = defineEmits<{
  (e: "change"): void
}>()

const userStore = useUserStore()
const switchRoles = ref(userStore.roles[0])
watch(switchRoles, async (value) => {
  await userStore.changeRoles(value)
  emit("change")
})
</script>

<template>
  <div>
    <div>你的权限：{{ userStore.roles }}</div>
    <div class="switch-roles">
      <span>切换权限：</span>
      <a-radio-group v-model:value="switchRoles">
        <a-radio-button value="editor">editor</a-radio-button>
        <a-radio-button value="admin">admin</a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<style lang="less" scoped>
.switch-roles {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
</style>
