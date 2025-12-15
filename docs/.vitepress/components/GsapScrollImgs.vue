<template>
  <div>
    <div class="imgs">
      <canvas id="image-sequence" width="1158" height="770" />
    </div>
  </div>
</template>
<style scoped>
.imgs {
  width: 100%;
  height: calc(100vh);
  background: #000;
}

canvas {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100vw;
  max-height: 100vh;
}
</style>

<script>
import gsap from "gsap";

import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default {
  name: "GsapScrollImgs",
  mounted() {
    gsap.registerPlugin(ScrollTrigger);

    // 寻找非擦洗版本？ https://codepen.io/GreenSock/pen/QWYdgjG
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".imgs",
        pin: true, // 将触发元素固定，在激活时
        start: "top top", // 当触发元素的顶部碰到视口顶部时
        end: "+=500", // 在起始位置滚动 500 像素后结束
        scrub: 1, // 平滑擦洗，需要 1 秒钟来“赶上”滚动条
        snap: {
          snapTo: "labels", // 捕捉到时间轴中最接近的标签
          duration: { min: 0.2, max: 3 }, // 捕捉动画应该至少 0.2 秒，但不超过 3 秒（由速度决定）
          delay: 0.2, // 从上一次滚动事件开始等待 0.2 秒后再进行捕捉
          ease: "power1.inOut", // 捕捉动画的缓动效果（默认是“power3”）
        },
      },
    });
    let frameCount = 147,
      urls = new Array(frameCount)
        .fill()
        .map(
          (o, i) =>
            `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(
              i + 1
            )
              .toString()
              .padStart(4, "0")}.jpg`
        );

    imageSequence({
      urls, // 图片 URL 数组
      canvas: "#image-sequence", // 要绘制图像的 <canvas> 对象
      //clear: true, // 仅在您的图像包含透明度时才有必要
      //onUpdate: (index, image) => console.log("drew image index", index, ", image:", image),
      scrollTrigger: {
        start: 0, // 从最顶部开始
        end: "max", // 整个页面
        scrub: true, // 重要！
      },
    });

    /*
      辅助函数，用于通过一系列图像进行擦洗，并将适当的图像绘制到提供的画布上。
      配置对象属性：
      - urls [数组]：图像 URL 的数组
      - canvas [画布]：用于绘制的 <canvas> 对象
      - scrollTrigger [对象]：可选的 ScrollTrigger 配置对象，例如 {trigger: "#trigger", start: "top top", end: "+=1000", scrub: true, pin: true}
      - clear [布尔值]：如果为 true，在绘制每一帧之前会清除画布（如果您的图像包含透明度，这很有用）
      - paused [布尔值]：如果为 true，则返回的动画最初将暂停（如果您传入的是擦洗的 ScrollTrigger，则这不是必需的，但如果您只是想要一个正常的播放动画，则很有帮助）
      - fps [数字]：可选的每秒帧数 - 这决定了返回的动画的持续时间。如果您使用的是擦洗的 ScrollTrigger，则这无关紧要。默认为 30 帧/秒。
      - onUpdate [函数]：Tween 更新时的可选回调（可能不常用）。它将传递两个参数：1）图像的索引（基于零），2）绘制到画布上的图像

      返回一个 Tween 实例
      */
    function imageSequence(config) {
      let playhead = { frame: 0 },
        canvas =
          gsap.utils.toArray(config.canvas)[0] || console.warn("canvas not defined"),
        ctx = canvas.getContext("2d"),
        curFrame = -1,
        onUpdate = config.onUpdate,
        images,
        updateImage = function () {
          let frame = Math.round(playhead.frame);
          if (frame !== curFrame) {
            // 仅在必要时绘制
            config.clear && ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[Math.round(playhead.frame)], 0, 0);
            curFrame = frame;
            onUpdate && onUpdate.call(this, frame, images[frame]);
          }
        };
      images = config.urls.map((url, i) => {
        let img = new Image();
        img.src = url;
        i || (img.onload = updateImage);
        return img;
      });
      return gsap.to(playhead, {
        frame: images.length - 1,
        ease: "none",
        onUpdate: updateImage,
        duration: images.length / (config.fps || 30),
        paused: !!config.paused,
        scrollTrigger: config.scrollTrigger,
      });
    }
  },
};
</script>
