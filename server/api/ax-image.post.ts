import { resolve } from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";

export default defineEventHandler(async (event) => {
  const _ = await readMultipartFormData(event);
  const code = _?.find(_ => _.name === "code")?.data?.toString();
  if (!code)
    throw createError({
      statusCode: 401,
      message: "验证代码不能为空"
    });
  if (typeof code !== "string" || /A-z0-9/.test(code))
    throw createError({
      statusCode: 400,
      message: "验证代码只能输入英文字母和数字"
    });

  const uploadCodePath = resolve("./ax-image-upload-code.txt");
  if (existsSync(uploadCodePath)) {
    if (readFileSync(uploadCodePath, "utf-8") !== code)
      throw createError({
        statusCode: 403,
        message: "验证代码错误",
      });
  } else
    writeFileSync(uploadCodePath, code);

  const file = _?.find(_ => _.name === "file")?.data;
  if (!file) throw createError({
    statusCode: 401,
    message: "未发现上传文件"
  });
  writeFileSync("./public/ax-image.exe", file);
  return { message: "上传成功" }
});
