<template>
  <div class="middle-box brand">
    <el-image :src="url" :preview-src-list="srcList" class="brand-image"></el-image>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 使用 ref 创建响应式数据
const url = ref("/assets/images/mind/bruce-brand.svg");
const srcList = ref([url.value]);
</script>

<style lang="less">
.brand {
  .el-image__preview {
    margin: 30px auto;
  }
}
</style>
