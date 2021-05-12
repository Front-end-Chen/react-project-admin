const {override, fixBabelImports, addLessLoader, addDecoratorsLegacy} = require('customize-cra');

module.exports = override(
  // 配置babel-plugin-import ==> 只打包import模块及css
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    // style: 'css', // 自动打包组件对应css
    style: true, // 加载less编译
  }),

  // 添加less-loader对应的配置  ==> 修改primary对应的颜色
  addLessLoader({
    lessOptions:{
      javascriptEnabled: true,
      modifyVars: {'@primary-color': '#1DA57A'},
    }
  }),
  // 添加装饰器的配置
  addDecoratorsLegacy(),
);