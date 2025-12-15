<template>
  <div>
    <div class="test"></div>
  </div>
</template>

<script>
import gsap from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin";
export default {
  name: "GsapText",
  mounted() {
    gsap.registerPlugin(TextPlugin);

    // 按照打字的交互呈现文本内容
    gsap.to(".test", {
      duration: 3,
      text: "This is the new text.哈哈哈，中文也支持，这就可以了",
      ease: "none",
    });
  },
};
</script>
