<template>
  <LinearGradientBackage ref="box">
    <ElCarousel class="carousel" ref="carousel" height="auto" @touchstart="onTouchstart" @touchend="onTouchend"
      :arrow="isMobile ? 'never' : 'hover'">
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image.png" alt="ax-image项目图片" />
      </ElCarouselItem>
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image-post.png" alt="ax-image项目帖子页面图片" />
      </ElCarouselItem>
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image-search.png" alt="ax-image项目搜索页面图片" />
      </ElCarouselItem>
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image-search-date.png" alt="ax-image项目搜索和时间限制标签图片" />
      </ElCarouselItem>
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image-search-history.png" alt="ax-image项目搜索历史图片" />
      </ElCarouselItem>
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image-setting.png" alt="ax-image项目设置页面图片" />
      </ElCarouselItem>
      <ElCarouselItem style="height: auto;">
        <NuxtImg src="/ax-image-download.png" alt="ax-image项目下载页面图片" />
      </ElCarouselItem>
    </ElCarousel>
    <section class="box">
      <h1>ax-image 项目</h1>
      <p>个人兴趣做的一个集图工具，需要开启代理才能正常使用。</p>
      <p>使用了k站和y站的 api 对帖子数据进行爬取展示。</p>
      <p>可以使用标签对帖子进行搜索过滤。</p>
      <p>可以查看帖子并进行图片下载，并对下载的图片进行管理。</p>
      <p>使用了 electron 技术打包成 pc 应用 ，使用它集成的 node api 进行图片文件的下载，删除，打开文件的操作，使用 electron api 选择文件保存目录，设置页面代理等功能。</p>
      <p>使用了 dexie包（indexedDB ）对下载数据（图片下载日期和位置等）和标签搜索历史数据的储存。</p>
      <p>页面使用了 vue 技术栈和 element-plus ui 框架进行开发，页面风格比较素，不想搞得太花里胡哨。</p>
      <p>项目地址：<NuxtLink target="_blank" to="https://github.com/axxuxy/ax-image">https://github.com/axxuxy/ax-image</NuxtLink></p>
      <p>下载链接：<NuxtLink external to="/api/ax-image" download="ax-image.exe" no-prefetch>ax-image.exe</NuxtLink>，记得需要在设置页面设置代理才能正常使用噢！</p>
    </section>
  </LinearGradientBackage>
</template>

<script lang="ts" setup>
import { type ElCarousel } from "element-plus"

useSeoMeta({
  title: "ax-image 项目",
  description: "一个收集图片的pc软件项目"
});

const carousel = ref<InstanceType<typeof ElCarousel>>();
let touchstart: TouchEvent;
function onTouchstart(ev: TouchEvent) {
  touchstart = ev;
}
function onTouchend(ev: TouchEvent) {
  const start = touchstart.touches.item(0)?.pageX, end = ev.changedTouches.item(0)?.pageX;
  if (start && end) {
    const x = end - start;
    if (x > 50) carousel.value?.prev();
    else if (x < -50) carousel.value?.next();
  }
  (ev.currentTarget as HTMLElement).blur();
}

const isMobile = ref(false);
onMounted(() => {
  isMobile.value = checkMobile();
});
</script>

<style lang="scss" scoped>
.carousel {
  :deep(ul) {
    white-space: nowrap;
  }

  img {
    width: 100%;
    max-height: 50vh;
    object-fit: cover;
    object-position: top;
  }
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