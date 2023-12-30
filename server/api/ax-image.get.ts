import { existsSync, createReadStream } from "fs";
import { axImagePath } from "~/server/api/ax-image.post";

export default defineEventHandler(async (event) => {
  if (existsSync(axImagePath)) {
    setHeaders(event, {
      "Content-type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=ax-image.exe"
    });
    return createReadStream(axImagePath);
  } else throw createError({
    statusCode: 404,
    message: "文件未上传",
  })
});