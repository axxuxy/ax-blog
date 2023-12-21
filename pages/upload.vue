<template>
  <ElContainer class="box">
    <ElForm style="min-width: 560px;min-height: 240px;">
      <ElFormItem label="验证代码">
        <ElInput name="code" type="password" placeholder="请输入上传验证码" v-model="code" show-password clearable />
      </ElFormItem>
      <ElFormItem label="选择文件">
        <ElUpload ref="upload" name="file" :headers="{
          accept: 'application/json'
        }" action="/api/ax-image" accept=".exe" :disabled="!code" :on-error="handleError" :data="{ code }" :limit="1"
          :on-exceed="handleExceed" :on-success="handleSuccess" v-model:file-list="files" style="flex: 1;">
          <ElButton type="primary">选择文件</ElButton>
          <template #tip>
            <div v-if="tip">
              <ElText type="danger" size="small">{{ tip }}</ElText>
            </div>
            <div v-else-if="!code">
              <ElText type="danger" size="small">请输入验证代码</ElText>
            </div>
            <div v-else-if="!verificationCode">
              <ElText type="danger" size="small">验证代码只能输入字母和数字</ElText>
            </div>
            <div v-else-if="!files.length">
              <ElText size="small">选择要上传ax-image.exe文件</ElText>
            </div>
          </template>
        </ElUpload>
      </ElFormItem>
    </ElForm>
  </ElContainer>
</template>

<script lang="ts" setup>
import { type UploadInstance, type UploadProps, type UploadRawFile, genFileId } from "element-plus";

const code = ref("");
const tip = ref("");
function handleError(_: Error & { status?: number }) {
  if (_.status)
    try {
      const __ = JSON.parse(_.message);
      tip.value = __.message;
    } catch (error) {
      tip.value = `解析异常发生错误：${_.message}`;
    }
  else
    tip.value = "请求连接异常";
}
const upload = ref<UploadInstance>()
const files = ref<UploadRawFile[]>([]);
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file);
  upload.value!.submit();
}
function handleSuccess() {
  tip.value = "";
}
const verificationCode = computed(() => /^[A-z0-9]*$/.test(code.value));
</script>

<style scoped lang="scss">
.box {
  height: 100vh;
  align-items: center;
  justify-content: center;
}
</style>