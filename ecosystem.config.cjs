const fs = require("fs");

module.exports = {
  apps: [
    {
      name: "ax-blog",
      script: "./.output/server/index.mjs",
      port: 443,
      exec_mode: "cluster",
      instances: "max",
      env: {
        NITRO_SSL_CERT: fs.readFileSync("key/axxu.xyz.pem", "utf-8"),
        NITRO_SSL_KEY: fs.readFileSync("key/axxu.xyz.key", "utf-8"),
      }
    }
  ]
}