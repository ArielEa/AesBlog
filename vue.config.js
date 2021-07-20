const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
// const isProd = process.env.NODE_ENV === 'production'
const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://47.110.155.139:9090/' : '/'
// console.log("aaaaa:" + isProd)
// const pluginOptions = {
//   projectName: 'AesBlog',
//   host: 'http://47.110.155.139:9090/',
//   port: 8080
// }

module.exports = {
  baseUrl: BASE_URL,
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // baseUrl: BASE_URL,
  publicPath: './',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },
  // 测试代理
  devServer: {
    host: 'localhost',
    port: 8081,
    proxy: {
      '^/api': {
        target: 'http://47.110.155.139:9090/',
        changeOrigin: true
      }
    }
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
}
