<script lang="ts" setup>
import "element-plus/theme-chalk/dark/css-vars.css";
import { type ElTimeline } from "element-plus";
import type FlipPageVue from "~/components/FlipPage.vue";

useSeoMeta({
  title: "ax许的个人简历",
  description: "ax许的个人简历",
});

const timeline = ref<InstanceType<typeof ElTimeline>>();
watch(timeline, _ => {
  if (_) {
    const style = ([...document.styleSheets].flatMap(_ => [..._.cssRules]) as CSSStyleRule[]).find(_ => _.selectorText === "html.dark")?.style;
    if (style) for (const name of style!) {
      (_.$el as HTMLElement).style.setProperty(name, style.getPropertyValue(name))
    }
  }
});

const flipPage = ref<InstanceType<typeof FlipPageVue>>();
let scrollTop = 0;
onActivated(() => {
  if (scrollTop) (flipPage.value!.$el as HTMLElement).scrollTo({
    top: scrollTop
  });
});
onBeforeRouteLeave(() => {
  scrollTop = (flipPage.value!.$el as HTMLElement).scrollTop;
});
</script>

<template>
  <LinearGradientBackage>
    <h1 style="display: none;">AX许-个人简历</h1>
    <FlipPage ref="flipPage">
      <template #page-user-info>
        <h2 style="display: none;">个人信息</h2>
        <p class="name">许俊鸿</p>
        <p class="gender">男</p>
        <p class="birth">1998 年 9 月</p>
        <p class="education-background">大专（计算机网络专业）</p>
        <p class="ipone">18975585982（微信同）</p>
      </template>
      <template #page-advantage>
        <h2 style="display: none;">个人优势</h2>
        <ul>
          <li>
            <p>熟练使用 vue2/vue3 全家桶，了解 vue 原理。</p>
          </li>
          <li>
            <p>熟悉 pc端 electron 和 app端 flutter 技术。</p>
          </li>
          <li>
            <p>熟练使用 typescript 做开发。</p>
          </li>
          <li>
            <p>熟悉 element-ui、vuetify 等 ui 框架和 echarts 图表，可以快速学习上手其他框架和工具库。</p>
          </li>
          <li>
            <p>熟悉 webpack、vite 等打包工具的使用。</p>
          </li>
          <li>
            <p>熟悉 vitest 做单元测试，熟悉 mockjs。</p>
          </li>
          <li>
            <p>熟悉前后端交互、了解 resultapi ，习惯使用 axios 工具库。</p>
          </li>
          <li>
            <p>熟悉 node 以及 npm、yarn、pnpm 等包管理工具。</p>
          </li>
          <li>
            <p>熟悉 git，vscode ，会操作 linux。</p>
          </li>
        </ul>
      </template>
      <template #page-personal-experience>
        <ElTimeline ref="timeline">
          <ElTimelineItem timestamp="1998-09" placement="top">
            <p>出生日期</p>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2004-09" placement="top">
            <p>就读小学。</p>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2010-09" placement="top">
            <p>就读初中。</p>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2013-09" placement="top">
            <p>就读于资兴市市立中学（高中）。</p>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2016-09" placement="top">
            <p>就读于湖南生物机电职业技术学院（大专）。</p>
            <p>计算机网络专业</p>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2019-09" placement="top">
            <p>从湖南生物机电职业技术学院毕业。</p>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2020-10" placement="top">
            <p>就职于湖南仪封安安科技股份有限公司。</p>
            <p>职位：前端开发</p>
            <ul class="detail">
              <li>
                <p>本人在公司负责app和web端迭代更新的和新项目的开发工作。</p>
              </li>
              <li>
                <p>app使用flutter技术进行跨平台开发。web端使用vue技术栈 + vuetify ui库，使用typescript。</p>
              </li>
              <li>
                <p>公司开发机使用liunx系统。使用gitlab做代码管理。</p>
              </li>
              <li>
                <p>公司项目app端和web端主要用来展示实时采集的体征和位置等数据。前端有使用百度地图服务展示用户的行动轨迹，echarts图表来展示用户体征状态，mqtt来进行接收用户实时体征数据。</p>
              </li>
            </ul>
          </ElTimelineItem>
          <ElTimelineItem timestamp="2022-05" placement="top">
            <p>从湖南仪封安安科技股份有限公司离职</p>
          </ElTimelineItem>
          <ElTimelineItem style="display: none;"></ElTimelineItem>
        </ElTimeline>
      </template>
      <template #page-project-show>
        <h2>项目展示</h2>
        <ul>
          <li>
            <NuxtLink to="/projects/ax-image">
              <NuxtImg src="/ax-image.png" alt="ax-image项目图片" />
            </NuxtLink>
            <h3>ax-image 项目</h3>
            <p>一个下载收集图片的项目</p>
            <p>项目地址：<NuxtLink target="_blank" to="https://github.com/axxuxy/ax-image">https://github.com/axxuxy/ax-image
              </NuxtLink>
            </p>
          </li>
          <li>
            <NuxtLink to="/projects/bubble">
              <NuxtImg src="/bubble.png" alt="bubble项目图片" />
            </NuxtLink>
            <h3>bubble 项目</h3>
            <p>一个气泡特效库</p>
            <p>项目地址：<NuxtLink target="_blank" to="https://github.com/axxuxy/bubble">https://github.com/axxuxy/bubble</NuxtLink>
            </p>
          </li>
        </ul>
      </template>
    </FlipPage>
  </LinearGradientBackage>
</template>

<style scoped lang="scss">
.page-user-info,
.page-advantage,
.page-personal-experience,
.page-project-show {
  color: #eee;
  user-select: none;
  font-size: var(--el-font-size-medium);

  p {
    margin: 0;
  }

  overflow: auto;
}

.page-user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .name {
    font-size: var(--el-font-size-extra-large);
  }

  .gender {
    font-size: var(--el-font-size-large);
  }

  @media only screen and (max-width:720px) {
    padding: 0 2em;
  }

  p {
    margin: 1em 0;
  }
}

.page-advantage {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5em;
  line-height: 1.6em;

  ul {
    padding-inline-start: 20px;
  }

  li {
    padding: 0.4em 0;
  }
}

.page-personal-experience {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 2em 4em;
  line-height: 1.5em;

  ul.detail {
    padding-left: 18px;
  }

  @media only screen and (max-width:720px) {
    padding: 1.5em;

    .el-timeline {
      padding: 0.5em;
    }
  }
}

.page-project-show {
  padding: 1em 2em;

  h2 {
    margin: 1em 0 1.5em;
  }

  ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    gap: 1em;
    padding: 0;

    li {
      width: calc((100% - 2em) / 3);

      img {
        width: 100%;
        aspect-ratio: 1.5;
        object-fit: cover;
      }

      h3 {
        margin: 0;
        padding: 0.8em 0 0.4em;
      }

      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-top: 0.4em;
      }

      a {
        display: inline !important;
        color: var(--el-color-primary);
      }

      @media only screen and (max-width:1280px) {
        width: calc((100% - 1em)/2);
      }

      @media only screen and (max-width: 720px) {
        width: 100%;
        padding-bottom: 1em;

        img {
          aspect-ratio: auto;
        }
      }
    }
  }

  @media only screen and (max-width:720px) {
    padding: 1em;
  }
}
</style>