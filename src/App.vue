<script lang="ts" setup>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN"

/** 将 ant design 的语言设置为中文 */
const locale = zh_CN
</script>

<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
