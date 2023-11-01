// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },

        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    // {
    //   path: '/pdf',
    //   menu: {
    //     name: 'pdf',
    //   },
    //   icon: 'HomeOutlined',
    //   component: './pdf',
    // },
    // {
    //   path: '/intelligentSearch',
    //   menu: {
    //     name: '智能搜索',
    //   },
    //   icon: 'HomeOutlined',
    //   component: './intelligentSearch/home',
    // },
    // {
    //   path: '/innovateManage',
    //   menu: {
    //     name: '方法台账',
    //   },
    //   icon: 'SolutionOutlined',
    //   component: './innovateManage',
    // },
    // {
    //   path: '/konwledgeStandingBook',
    //   menu: {
    //     name: '知识台账',
    //   },
    //   icon: 'ReadOutlined',
    //   component: './konwledgeStandingBook/query',
    // },
    {
      path: '/overview',
      menu: {
        name: '工作台',
      },
      icon: 'HomeOutlined',
      component: './Welcome',
      // component: './overview',
      //  routes: [{
      //     path: '/welcome',
      //     icon: 'smile',
      //     redirect: '/welcome',
      //       menu: {
      //   name: '欢迎页',
      // },
      //   }],
    },
    {
      path: '/fan/:activeKey',
      menu: {
        name: '风机选型',
      },
      icon: 'RadarChartOutlined',
      component: './fan',
    },
    // {
    //   path: '/fan/:activeKey',
    //   menu: {
    //     name: '冷却塔选型',
    //   },
    //   icon: 'RadarChartOutlined',
    //   // component: './fan',
    // },
    // {
    //   path: '/fan/:activeKey',
    //   menu: {
    //     name: '制动电阻选型',
    //   },
    //   icon: 'RadarChartOutlined',
    //   // component: './fan',
    // },
    // {
    //   path: '/fan/:activeKey',
    //   menu: {
    //     name: '叶轮选型',
    //   },
    //   icon: 'RadarChartOutlined',
    //   // component: './fan',
    // },
    // {
    //   path: 'fan/create/model',
    //   component: './fan/create',
    // },
    {
      path: '/fans/create',
      component: './fan/create',
    },
    // {
    //   path: '/fan/create/:id',
    //   component: './fan/create',
    // },
    {
      path: '/fans/detail',
      component: './fan/components/detail',
    },
    {
      path: '/fans/audit',
      component: './fan/components/audit',
    },
    {
      path: '/fans/auditAlter',
      component: './fan/components/alter',
    },
    // {
    //   path: '/fan/detail/:model/:activeKey',
    //   component: './fan/components/detail',
    // },
    {
      path: '/fans/report',
      component: './fan/components/report',
    },
    {
      path: '/similarDesign/report',
      component: './fan/similarDesign/components/report',
    },
    // {
    //   path: '/fan/report/:model',
    //   component: './fan/components/report',
    // },
    {
      path: '/fans/similarDesign/detail/:activeKey',
      component: './fan/similarDesign/detail',
    },
    // {
    //   path: '/fan/similarDesign/detail/:model',
    //   component: './fan/similarDesign/detail',
    // },
    // {
    //   path: '/example',
    //   menu: {
    //     name: '案例台账',
    //   },
    //   icon: 'ProjectOutlined',
    //   component: './example',
    // },
    // {
    //   path: '/fitnessScore',
    //   menu: {
    //     name: '适应度评分',
    //   },
    //   icon: 'form',
    //   component: './fitnessScore',
    // },
    // {
    //   path: '/konwledgeStandingBook/create',
    //   component: './konwledgeStandingBook/create',
    // },
    // {
    //   path: '/intelligentSearch/records/:param/:type/:key',
    //   component: './intelligentSearch/records',
    // },
    // {
    //   path: '/intelligentSearch/detail/:id',
    //   component: './intelligentSearch/detail',
    // },
    // {
    //   path: '/intelligentSearch/knowledgeDetail/:id',
    //   component: './intelligentSearch/knowledgeDetail',
    // },
    // {
    //   path: '/intelligentSearch/resource',
    //   component: './intelligentSearch/resource',
    // },
    // {
    //   path: '/intelligentSearch/methods',
    //   component: './intelligentSearch/methods',
    // },
    // {
    //   path: '/standardWork/supervision/create',
    //   component: './standardWork/supervision/create',
    // },
    // {
    //   path: '/standardWork/examine/create',
    //   component: './standardWork/examine/create',
    // },
    // {
    //   path: '/fitnessScore/create',
    //   component: './fitnessScore/create',
    // },
    // {
    //   path: '/innovateManage/create',
    //   component: './innovateManage/create',
    // },
    // {
    //   path: '/example/create',
    //   component: './example/create',
    // },
    // {
    //   path: '/example/detail',
    //   component: './example/detail',
    // },
    // {
    //   path: '/quota',
    //   menu: {
    //     name: '定额管理',
    //   },
    //   icon: 'smile',
    //   routes: [
    //     {
    //       path: '/quota/material',
    //       menu: {
    //         name: '材料定额',
    //       },
    //       component: './quota/material',
    //     },
    //     {
    //       path: '/quota/workHours',
    //       menu: {
    //         name: '工时定额',
    //       },
    //       component: './quota/workHours',
    //     },
    //   ],
    // },
    // {
    //   path: '/standardWork',
    //   menu: {
    //     name: '标准化作业',
    //   },
    //   icon: 'smile',
    //   routes: [
    //     {
    //       path: '/standardWork/supervision/query',
    //       menu: {
    //         name: '日常督察',
    //       },
    //       component: './standardWork/supervision/query',
    //     },
    //     {
    //       path: '/standardWork/examine/query',
    //       menu: {
    //         name: '专项审核',
    //       },
    //       component: './standardWork/examine/query',
    //     },
    //   ],
    // },

    {
      path: '/system',
      menu: {
        name: '系统管理',
      },
      icon: 'smile',
      // access: 'canAdmin',
      // component: './System',
      routes: [
        {
          path: 'UserList',
          menu: {
            name: '用户管理',
          },
          component: './system/UserList',
        },
        {
          path: 'RoleList',
          menu: {
            name: '用户角色',
          },
          component: './system/RoleList',
        },
        {
          path: 'MenuList',
          menu: {
            name: '菜单管理',
          },
          component: './system/MenuList',
        },
        {
          path: 'UserAction',
          menu: {
            name: '行为监控',
          },
          component: './system/UserAction',
          // component: './system/FanIntroduction',
        },
        {
          path: 'FanIntroduction',
          menu: {
            name: '风机产品管理',
          },
          component: './system/FanIntroduction',
        },
        {
          path: 'Manage',
          menu: {
            name: '系统配置',
          },
          component: './system',
        },
        {
          path: 'Department',
          menu: {
            name: '部门管理',
          },
          component: './system/Department',
        },
      ],
    },

    // {
    //   name: 'exception',
    //   icon: 'warning',
    //   path: '/exception',
    //   routes: [
    //     {
    //       path: '/exception',
    //       redirect: '/exception/403',
    //     },
    //     {
    //       name: '403',
    //       icon: 'smile',
    //       path: '/exception/403',
    //       component: './exception/403',
    //     },
    //     {
    //       name: '404',
    //       icon: 'smile',
    //       path: '/exception/404',
    //       component: './exception/404',
    //     },
    //     {
    //       name: '500',
    //       icon: 'smile',
    //       path: '/exception/500',
    //       component: './exception/500',
    //     },
    //   ],
    // },
    // {
    //   name: 'account',
    //   icon: 'user',
    //   path: '/account',
    //   routes: [
    //     {
    //       path: '/account',
    //       redirect: '/account/center',
    //     },
    //     {
    //       name: 'center',
    //       icon: 'smile',
    //       path: '/account/center',
    //       component: './account/center',
    //     },
    //     {
    //       name: 'settings',
    //       icon: 'smile',
    //       path: '/account/settings',
    //       component: './account/settings',
    //     },
    //   ],
    // },

    {
      path: '/',
      redirect: '/user/login',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    // "text-color":"#1890ff", // 主文本色
  },
  // styles: [`body { color: red; }`, `https://a.com/b.css`],
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
