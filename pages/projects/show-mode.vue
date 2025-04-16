<template>
  <LinearGradientBackage>
    <ElContainer class="container">
      <ElMain>
        <div ref="threeContainer" style="position: fixed;top: 0;left: 0;z-index: -1;width: 100%; height: 100%;"
          :style="{ opacity: model ? 1 : 0, zIndex: model ? 0 : -1 }">
        </div>
        <div v-show="!model" class="file-input-box">
          <ElUpload @change="fileChange" accept=".glb,.gltf" :auto-upload="false" drag :show-file-list="false"
            style="flex: 1;">
            <ElIcon class="el-icon--upload">
              <ElIconPlus />
            </ElIcon>
            <p class="el-upload__text">
              <ElText size="large">选择一个本地GLB模型文件</ElText>
            </p>
          </ElUpload>
        </div>
      </ElMain>
    </ElContainer>
  </LinearGradientBackage>
</template>

<script setup lang="ts">
// TODO 添加加载模型的进度条
// TODO 在移除模型时需要销毁所有能销毁的3D对象
import { AmbientLight, AnimationMixer, Box3, Clock, Color, Mesh, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { EffectComposer, GLTFLoader, RenderPass, SMAAPass, type GLTF } from "three/examples/jsm/Addons.js";
import { type UploadFile } from "element-plus";

const threeContainer = ref<HTMLDivElement>();
const model = shallowRef<GLTF>()
function fileChange(file: UploadFile) {
  if (file.raw) {
    const url = URL.createObjectURL(file.raw);
    new GLTFLoader().loadAsync(
      url
    ).then((gltf) => {
      model.value = gltf;
    });
  }
}

onMounted(() => {
  const camera = new PerspectiveCamera(30, 1.5);
  camera.position.set(0, 0, 15);

  const scene = new Scene();
  scene.background = new Color(0x666666);

  const light = new AmbientLight(0xffffff, 2.5);
  scene.add(light);

  const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(window.devicePixelRatio);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new SMAAPass());
  onUnmounted(() => {
    renderer.dispose();
    composer.dispose();
  });

  const mixer = computed(() => {
    if (model.value?.animations) {
      const mixer = new AnimationMixer(model.value.scene);
      model.value.animations.forEach(_ => mixer.clipAction(_).play());
      return mixer;
    }
  });
  watch(mixer, (mixer, oldMixer) => {
    oldMixer?.stopAllAction();
  });

  function toCenten(scene: Object3D) {
    const center = new Box3().expandByObject(scene).getCenter(new Vector3());
    scene.children.forEach(_ => {
      _.position.set(-center.x, -center.y, -center.z);
    })
  }
  watch(model, (model, oldModel) => {
    if (oldModel)
      scene.remove(oldModel.scene);
    if (model) {
      model.scene.traverse((item) => {
        if (item instanceof Mesh) {
          if (!item.material.map)
            item.visible = false;
          else
            item.material.depthWrite = true;
        }
      });
      toCenten(model.scene);
      scene.add(model.scene);
    }
  });

  watch(threeContainer, (element) => {
    if (element)
      element.appendChild(renderer.domElement);
  }, { immediate: true });

  let moveAdd: { x: number, y: number }[] = [];
  let rotateAdd: { x: number, y: number }[] = [];
  let updatePositionZ: number[] = [];
  let updatePositionZInTouch: [Touch, Touch][] = [];
  function updateModelAndCamera() {
    if (model.value) {
      if (moveAdd.length) {
        const { x, y } = moveAdd.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
        model.value.scene.position.x += x;
        model.value.scene.position.y += y;
        moveAdd = [];
      }
      if (rotateAdd.length) {
        const { x, y } = rotateAdd.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
        model.value.scene.rotateOnWorldAxis(new Vector3(1, 0, 0), x / 180);
        model.value.scene.rotateOnWorldAxis(new Vector3(0, 1, 0), y / 180);
        rotateAdd = [];
      }
      if (updatePositionZ.length) {
        camera.position.z += updatePositionZ.reduce((a, b) => a + b, 0);
        updatePositionZ = [];
      }
      if (updatePositionZInTouch.length > 1) {
        const [touch1, touch2] = updatePositionZInTouch[0],
          [touch3, touch4] = updatePositionZInTouch.at(-1)!;
        camera.position.z += ((Math.abs(touch1.clientX - touch2.clientX) + Math.abs(touch1.clientY - touch2.clientY)) - (Math.abs(touch3.clientX - touch4.clientX) + Math.abs(touch3.clientY - touch4.clientY))) / 30;
        updatePositionZInTouch = [];
      }
    }
  }

  let resetSize: { width: number; height: number } | undefined;
  function resetSizeFun() {
    if (resetSize) {
      const { width, height } = resetSize;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      resetSize = undefined;
    }
  }

  {
    let animateTime: number;
    const clock = new Clock();
    function animate() {
      animateTime = requestAnimationFrame(animate);
      resetSizeFun();
      updateModelAndCamera();
      mixer.value?.update(clock.getDelta())
      composer.render();
    };
    animate();
    onUnmounted(() => cancelAnimationFrame(animateTime))
  }

  {
    const resizeObserver = new ResizeObserver((entries) => {
      const entrie = entries.find(_ => _.target === renderer.domElement);
      if (entrie) resetSize = entrie.contentRect;
    })
    resizeObserver.observe(renderer.domElement);
    onUnmounted(() => resizeObserver.disconnect());
  }

  {
    function onWheel(ev: WheelEvent) {
      updatePositionZ.push(ev.shiftKey ? ev.deltaY / 1000 : ev.deltaY / 100);
    }
    renderer.domElement.addEventListener("wheel", onWheel);
    onUnmounted(() => renderer.domElement.removeEventListener("wheel", onWheel))
  }

  {
    function onMove(ev: MouseEvent) {
      if (!model.value) return;
      if (ev.buttons === 4) {
        moveAdd.push({ x: ev.movementX / 100, y: -ev.movementY / 100 });
      }
      else if (ev.buttons === 1) {
        rotateAdd.push({ x: ev.movementY, y: ev.movementX });
      }
    }
    renderer.domElement.addEventListener("mousemove", onMove);
    onUnmounted(() => renderer.domElement.removeEventListener("mousemove", onMove));
  }

  {
    function closeModelAlert(ev?: Event) {
      ElMessageBox.confirm("关闭模型显示面板？？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => model.value = undefined)
        .catch(() => undefined);
      ev?.preventDefault();
      return false;
    }
    renderer.domElement.addEventListener("contextmenu", closeModelAlert);
    onUnmounted(() => {
      renderer.domElement.removeEventListener("contextmenu", closeModelAlert);
    });
  }

  {
    let touch: Touch | undefined;
    let touchedAfter300MS = false;
    let touchedAfter300MSTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const modeIsMove = ref(true);
    watch(modeIsMove, _ => {
      ElMessage.success(_ ? "移动模式" : "旋转模式");
    });
    function onTouchstart(ev: TouchEvent) {
      clearTimeout(touchedAfter300MSTimeoutId);
      if (touchedAfter300MS && ev.touches.length <= 1) {
        touchedAfter300MS = false;
        modeIsMove.value = !modeIsMove.value;
        ev.preventDefault();
        return false;
      }
      touchedAfter300MS = true;
      touchedAfter300MSTimeoutId = setTimeout(() => {
        touchedAfter300MS = false;
      }, 300);
    }
    function onTouchmove(event: TouchEvent) {
      if (!model.value) return;
      if (event.touches.length === 2) {
        updatePositionZInTouch.push([event.touches[0], event.touches[1]]);
      } else {
        updatePositionZInTouch = [];

        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (touch) {
            const x = (t.clientX - touch.clientX) * window.devicePixelRatio, y = (t.clientY - touch.clientY) * window.devicePixelRatio;
            if (modeIsMove.value)
              moveAdd.push({ x: x / 200, y: -y / 200 });
            else
              rotateAdd.push({ x: y, y: x });
          }
          touch = t;
        }
      }
      event.preventDefault();
      return false;
    }
    function onTouched(ev: TouchEvent) {
      touch = undefined;
      ev.preventDefault();
      return false;
    }
    renderer.domElement.addEventListener("touchmove", onTouchmove);
    renderer.domElement.addEventListener("touchend", onTouched);
    renderer.domElement.addEventListener("touchstart", onTouchstart);
    onUnmounted(() => {
      renderer.domElement.removeEventListener("touchmove", onTouchmove);
      renderer.domElement.removeEventListener("touchend", onTouched);
      renderer.domElement.removeEventListener("touchstart", onTouchstart);
    })
  }
})
</script>

<style scoped lang="scss">
.container {
  height: 100%;

  .file-input-box {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 640px;
    height: 100%;
    padding: 0 18px;
    margin: auto;
    box-sizing: border-box;

    p {
      margin: 0;
    }
  }
}
</style>
