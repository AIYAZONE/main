<template>
  <div class="middle-box brand">
    <el-image :src="url" :preview-src-list="srcList"></el-image>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 使用 ref 创建响应式数据
const url = "/assets/images/mind/bruce-brand.svg";
const srcList = [url];
</script>

<style lang="less">
.brand .el-image__preview {
  margin: 30px auto;
}
</style>
