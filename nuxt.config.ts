// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  devServer: {
    host: "0.0.0.0"
  },
  modules: ["@element-plus/nuxt", "@nuxt/image"],
})