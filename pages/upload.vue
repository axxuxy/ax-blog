<template>
  <ElContainer class="box">
    <ElForm style="min-width: 560px;min-height: 240px;">
      <ElFormItem label="验证代码">
        <ElInput name="code" type="password" placeholder="请输入上传验证码" v-model="code" show-password clearable />
      </ElFormItem>
      <ElFormItem label="选择文件">
        <ElUpload ref="upload" name="file" accept=".exe" :disabled="!code" :data="{ code }" :limit="1"
          :on-exceed="handleExceed" v-model:file-list="files" style="flex: 1;" :http-request="uploadFile">
          <ElButton type="primary">选择文件</ElButton>
          <template #tip>
            <div>
              <ElText v-if="dangerTip" type="danger" size="small">{{ dangerTip }}</ElText>
              <ElText v-else size="small">选择要上传ax-image.exe文件</ElText>
            </div>
          </template>
        </ElUpload>
      </ElFormItem>
    </ElForm>
  </ElContainer>
</template>

<script lang="ts" setup>
import { type UploadInstance, type UploadProps, type UploadRawFile, genFileId } from "element-plus";
import axios, { type AxiosError } from "axios";

const code = ref("");
const tip = ref("");
const dangerTip = computed(() => {
  if (!code.value) return "请输入验证代码";
  if (!/^[A-z0-9]*$/.test(code.value)) return "验证代码只能输入字母和数字";
  if (tip.value) return `上传失败：${tip.value}`;
});

const upload = ref<UploadInstance>()
const files = ref<UploadRawFile[]>([]);
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file);
  upload.value!.submit();
}

async function uploadFile(option: Parameters<UploadProps["httpRequest"]>[0]) {
  return await axios.request({
    method: "POST",
    params: { code: code.value },
    url: "/api/ax-image",
    data: option.file,
    onUploadProgress(_) {
      const event: ProgressEvent & { percent?: number } = new ProgressEvent("");
      event.percent = (_.progress ?? 0) * 100;
      option.onProgress(event as ProgressEvent & { percent: number });
    }
  }).then(() => {
    tip.value = ""
  }).catch(error => {
    tip.value = (error as AxiosError<{ message: string }>)?.response?.data?.message ?? "网络连接异常";
    throw error;
  });
}
</script>

<style scoped lang="scss">
.box {
  height: 100vh;
  align-items: center;
  justify-content: center;
}
</style>