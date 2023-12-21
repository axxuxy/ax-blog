<template>
  <div class="linear-gradient">
    <slot />
  </div>
</template>

<style >
.linear-gradient {
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to left bottom, #000000cc 5%, #000000);
  color: #fff;
  overflow: auto;
}
</style>