const { readFileSync } = require("fs");
const { resolve } = require("path");

module.exports = {
  apps: [
    {
      name: "ax-blog",
      script: "server/index.mjs",
      cwd: resolve(__dirname, ".output"),
      port: 443,
      exec_mode: "cluster",
      instances: "max",
      env: {
        NITRO_SSL_CERT: readFileSync(resolve(__dirname, "key/axxu.xyz.pem"), "utf-8"),
        NITRO_SSL_KEY: readFileSync(resolve(__dirname, "key/axxu.xyz.key"), "utf-8"),
      }
    }
  ]
}