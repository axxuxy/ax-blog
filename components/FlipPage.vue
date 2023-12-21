<script lang="ts" setup>
type SlotKey = `page-${string}`;
const slots = defineSlots<{
  [key: SlotKey]: () => VNode | VNode[]
}>();
const keys = computed(() => Object.keys(slots) as SlotKey[]);

const parentScopeId = ref<string>(getCurrentInstance()?.parent?.vnode.scopeId ?? '');

const isMobile = ref(false);
onMounted(() => {
  isMobile.value = checkMobile();
})
</script>

<template>
  <div class="flip-page" :class="{ 'is-mobile': isMobile }">
    <div v-for="key in keys" :key="key" class="page" :class="key" v-bind:[parentScopeId]="''">
      <slot :name="key"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flip-page {
  position: relative;
  height: 100%;
  margin: 0;
  overflow: auto;
  scroll-snap-type: both mandatory;

  &>div {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  &.is-mobile>div {
    height: 100%;
    overflow: auto;
  }
}
</style>