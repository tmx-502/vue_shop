/*
 * @Description:
 * @Author: liutq
 * @Date: 2021-07-22 09:10:57
 * @LastEditTime: 2021-07-26 17:39:59
 * @LastEditors: liutq
 * @Reference:
 */
module.exports = {
  lintOnSave: false

  /*  chainWebpack: config => {
    发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  } */
}
