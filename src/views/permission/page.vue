<script lang="ts" setup>
import { useRouter } from "vue-router"
import SwitchRoles from "./components/SwitchRoles.vue"

const router = useRouter()
const handleRolesChange = () => {
  router.push({ path: "/403" })
}
</script>

<template>
  <div class="app-container">
    <a-tag color="green" size="large"> 当前页面只有 admin 权限可见 </a-tag>
    <SwitchRoles @change="handleRolesChange" />
  </div>
</template>

<style lang="scss" scoped>
.a-tag {
  margin-bottom: 15px;
}
</style>
