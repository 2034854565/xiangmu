/*
 * @Author: 嘉欣 罗 2592734121@qq.com
 * @Date: 2022-12-20 12:57:52
 * @LastEditors: ljx luojiaxincap@163.com
 * @LastEditTime: 2023-01-18 16:56:11
 * @FilePath: \psad-front\config\proxy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

export default {
  // dev: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  dev: {
    // '/phm-web-service-gz/': {
    //   target: 'http://119.23.127.239:3333', //调试 changeOrigin: true,
    //   pathRewrite: { '^/phm-web-service-gz': '/phm-web-service-gz' },
    // },
    '/imip/': {
      target: 'http://192.168.2.7:8010',
      // target: 'http://127.0.0.1:8010',
    },
    // '/api/': {
    //   target: 'http://172.16.50.87:8010', //调试 changeOrigin: true,
    //   // target: 'http://127.0.0.1:8010',
    // },
    '/api/': {
      // target: 'http://172.16.50.36:8010', //调试 changeOrigin: true,
      // target: 'http://172.16.50.86:8010',
      target: 'http://127.0.0.1:8010',
    },
    '/phm-web-service-gz/': {
      target: 'http://127.0.0.1:8010', //调试 changeOrigin: true,
      pathRewrite: { '^/phm-web-service-gz': '/phm-web-service-gz' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
