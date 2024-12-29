<template>
  <div class="wrapper">
    <Header />
    <main class="app-main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./layout/Header.vue";
import Footer from "./layout/Footer.vue";

export default defineComponent({
  name: "App",
  components: {
    Header,
    Footer,
  },
});
</script>
