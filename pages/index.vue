<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getGradientText } from "~/composables/gradientText";

useSeoMeta({
  title: "ax许的个人站点",
  description: "ax许，一条躺平的咸鱼···",
});

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const ctx = canvas.value!.getContext("2d")!;
  const width = ctx.canvas.clientWidth * window.devicePixelRatio;
  const height = ctx.canvas.clientHeight * window.devicePixelRatio;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  const gradientText = getGradientText("一条躺平的咸鱼···", { width: Math.round(width * 0.9), maxHeight: height * 0.1 });
  const saltedFish = getSaltedFish({
    maxWidth: Math.round(width * 0.9),
    maxHeight: height * 0.6
  });

  let gradientCirclePosition: { x: number; y: number; } | undefined;
  function updateGradientCirclePosttion(ev: MouseEvent) {
    if ("ontouchstart" in document.documentElement) return;

    const x = ev.offsetX * window.devicePixelRatio;
    const y = ev.offsetY * window.devicePixelRatio;
    gradientCirclePosition = { x, y }
    const saltedFishTop = 0.2 * ctx.canvas.height + (0.8 * ctx.canvas.height - saltedFish.height) / 2;
    const saltedFishLeft = (ctx.canvas.width - saltedFish.width) / 2;
    if (
      y > saltedFishTop &&
      y < (saltedFishTop + saltedFish.height) &&
      x > saltedFishLeft &&
      x < (saltedFishLeft + saltedFish.width)
    ) ctx.canvas.style.cursor = "pointer"
    else ctx.canvas.style.removeProperty("cursor");
  }
  ctx.canvas.addEventListener("mousemove", updateGradientCirclePosttion);

  let timeout: ReturnType<typeof setTimeout>;
  function onClickSaltedFish(ev: MouseEvent) {
    const saltedFishTop = 0.2 * ctx.canvas.height + (0.8 * ctx.canvas.height - saltedFish.height) / 2;
    const saltedFishLeft = (ctx.canvas.width - saltedFish.width) / 2;
    const x = ev.clientX * window.devicePixelRatio;
    const y = ev.clientY * window.devicePixelRatio;
    if (
      y > saltedFishTop &&
      y < (saltedFishTop + saltedFish.height) &&
      x > saltedFishLeft &&
      x < (saltedFishLeft + saltedFish.width)
    ) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        navigateTo("/resume");
      }, 2500);
      saltedFish.reset();
    }
  }
  ctx.canvas.addEventListener("click", onClickSaltedFish);

  function draw() {
    const width = ctx.canvas.clientWidth * window.devicePixelRatio;
    const height = ctx.canvas.clientHeight * window.devicePixelRatio;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.clearRect(0, 0, width, height)

    /// Draw backage.
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#000b");
    gradient.addColorStop(0.2, "#000d");
    gradient.addColorStop(0.5, "#000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    /// Draw gradient circle.
    if (gradientCirclePosition) {
      const r = Math.sqrt(width * height) / 6;
      const gradientCircle = ctx.createRadialGradient(gradientCirclePosition.x, gradientCirclePosition.y, 0, gradientCirclePosition.x, gradientCirclePosition.y, r);
      gradientCircle.addColorStop(0, "#ffffff40");
      gradientCircle.addColorStop(1, "#ffffff00");
      ctx.fillStyle = gradientCircle;
      ctx.fillRect(0, 0, width, height);
    }

    /// Draw Text.
    const top = height * 0.1;
    gradientText.update();
    ctx.drawImage(gradientText, 0.05 * canvas.value!.width, top + (0.1 * height - gradientText.height) / 2, ctx.canvas.width * 0.9, gradientText.width / ctx.canvas.width * gradientText.height);

    /// Draw salted fish.
    saltedFish.update();
    ctx.drawImage(saltedFish, (width - saltedFish.width) / 2, 0.2 * height + (0.8 * height - saltedFish.height) / 2);
  }
  draw();

  let time: ReturnType<typeof requestAnimationFrame>;
  (function update() {
    time = requestAnimationFrame(() => {
      draw();
      update();
    });
  })();

  let touchStart: TouchEvent;
  function onTouchstart(ev: TouchEvent) {
    touchStart = ev;
  }
  ctx.canvas.addEventListener("touchstart", onTouchstart);
  function onTouchend(ev: TouchEvent) {
    if ((touchStart.changedTouches[0].clientY - ev.changedTouches[0].clientY) > 50)
      useRouter().push("/resume");
  }
  ctx.canvas.addEventListener("touchend", onTouchend);

  onUnmounted(() => {
    cancelAnimationFrame(time);
    ctx.canvas.removeEventListener("mousemove", updateGradientCirclePosttion);
    ctx.canvas.removeEventListener("click", onClickSaltedFish);
    ctx.canvas.removeEventListener("touchstart", onTouchstart);
    ctx.canvas.removeEventListener("touchend", onTouchend);
  });
});
</script>

<template>
  <div style="display: none;">
    <h1>这里是ax的个人网站</h1>
    <p>一条躺平的咸鱼···</p>
  </div>
  <canvas ref="canvas" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;user-select: none;"></canvas>
</template>