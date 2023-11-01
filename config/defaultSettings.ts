/*
 * @Author: 嘉欣 罗 2592734121@qq.com
 * @Date: 2022-12-20 12:57:52
 * @LastEditors: 嘉欣 罗 2592734121@qq.com
 * @LastEditTime: 2022-12-29 15:29:46
 * @FilePath: \psad-front\config\defaultSettings.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '产品选型和设计平台',
  pwa: false,
  logo: '/lince.png',
  iconfontUrl: '',
};

export default Settings;
