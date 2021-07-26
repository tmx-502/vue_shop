/*
 * @Description:
 * @Author: liutq
 * @Date: 2021-07-22 09:09:49
 * @LastEditTime: 2021-07-26 16:00:43
 * @LastEditors: liutq
 * @Reference:
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    'transform-remove-console'
  ]
}
