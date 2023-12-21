<template>
  <LinearGradientBackage>
    <canvas ref="canvas" :style="{
      backgroundImage: `url(${backage})`
    }"></canvas>
    <section class="box">
      <h1>bubble 工具库</h1>
      <p>一个戳泡泡的工具库，以前做的一个泡泡特效，使用canvas绘制，可以点击戳破泡泡并生成新泡泡。</p>
      <p>工具库定义了画布 Canvas，气泡 Bubble，向量 Vector等类来操作气泡移动和计算碰撞效果。</p>
      <p>工具库代码使用 typescript 语言，使用 rollup 打包，代码详细情况可以前往 github 地址：<NuxtLink target="_blank" to="https://github.com/axxuxy/bubble">
          https://github.com/axxuxy/bubble</NuxtLink> 查看下载。</p>
    </section>
  </LinearGradientBackage>
</template>

<script lang="ts" setup>
import { WebBubbleCanvas } from "bubble";
import backage from "bubble/backage.jpg";

useSeoMeta({
  title: "bubble 工具库",
  description: "一个戳泡泡玩的工具库"
});

const canvas = ref<HTMLCanvasElement>();
onMounted(() => {
  const bubble = new WebBubbleCanvas({ maxBubbleCount: 20 });
  Array.from(canvas.value!.attributes).forEach(_ => bubble.canvas.setAttribute(_.name, _.value))
  canvas.value!.replaceWith(bubble.canvas);
  onUnmounted(() => bubble.stopAnimation());
});
</script>

<style scoped lang="scss">
canvas {
  width: 100%;
  height: 50vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.box {
  max-width: 1280px;
  margin: auto;
  padding: 1em 2em;

  h1 {
    font-size: var(--el-font-size-extra-large);
    line-height: 2em;
  }

  p {
    text-indent: 2em;
    line-height: 1.8em;
  }
}
</style>