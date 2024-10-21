const {defineConfig} = require("@vue/cli-service")
const path = require("path");

module.exports = defineConfig({
    productionSourceMap: false,
    transpileDependencies: true,
    outputDir: path.resolve(__dirname, "../public"),
})

