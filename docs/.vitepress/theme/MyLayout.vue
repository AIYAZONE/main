<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import Home from "../../../src/views/Home.vue";

import Header from "../../../src/layout/Header.vue";
import Footer from "../../../src/layout/Footer.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>

<template>
  <div class="vp-custom-layout">
    <Header />
    <Layout>
      <template #home-hero-before>
        <div v-if="frontmatter.isCustomHome" class="custom-home-wrapper">
          <Home />
        </div>
      </template>
    </Layout>
    <Footer />
  </div>
</template>

<style>
.custom-home-wrapper {
  width: 100%;
}

.VPFooter {
  display: none !important;
}

.VPNavBar {
  display: none !important;
}

.VPDoc {
  padding-bottom: 0 !important;
}
</style>
