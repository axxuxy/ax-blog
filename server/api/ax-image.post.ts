import { resolve } from "path";
import { readFileSync, existsSync, writeFileSync, createWriteStream, mkdirSync } from "fs";
const axImagePathDir = resolve(process.cwd(), "upload");
export const axImagePath = resolve(axImagePathDir, "ax-image.exe");

export default defineEventHandler(async (event) => {
  const code = getQuery<{ code: string }>(event).code;
  if (!code) {
    await event.node.req.forEach(() => { }).then(() => {
      throw createError({
        statusCode: 401,
        message: "验证代码不能为空"
      });
    })
  }
  if (typeof code !== "string" || /A-z0-9/.test(code))
    await event.node.req.forEach(() => { }).then(() => {
      throw createError({
        statusCode: 400,
        message: "验证代码只能输入英文字母和数字"
      })
    });

  const uploadCodePath = resolve("./ax-image-upload-code.txt");
  if (existsSync(uploadCodePath)) {
    if (readFileSync(uploadCodePath, "utf-8") !== code)
      await event.node.req.forEach(async () => { }).then(() => {
        throw createError({
          statusCode: 403,
          message: "验证代码错误",
        });
      })
  } else
    writeFileSync(uploadCodePath, code);

  return await new Promise<void>((resolve, reject) => {
    if (!existsSync(axImagePathDir)) mkdirSync(axImagePathDir, { recursive: true })
    const write = createWriteStream(axImagePath, {});
    event.node.req.pipe(write);
    function onError(error: Error) {
      reject(createError({
        statusCode: 500,
        message: `写入文件异常\n${error}`
      }))
    }
    write.once("error", onError);
    event.node.req.once("error", onError)
    write.once("end", resolve);
    event.node.req.once("close", resolve);
  }).then(() => ({ message: "上传成功" }));
});
