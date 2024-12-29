<template>
  <div>
    <h2>Home View</h2>
    <p>Current count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useCounterStore } from "../store/counter";

export default defineComponent({
  setup() {
    const counterStore = useCounterStore();

    const count = computed(() => counterStore.count);

    return {
      count,
      increment: counterStore.increment,
    };
  },
});
</script>
