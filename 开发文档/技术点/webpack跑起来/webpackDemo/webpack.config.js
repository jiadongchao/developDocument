/**
 * Created by Administrator on 2017/9/12.
 */
var webpack = require('webpack');
module.exports = {
  //页面入口文件配置
  entry: [
    // 'webpack/hot/only-dev-server',
    "./js/app.js"
  ],
  //入口文件输出配置
  output: {
    path: __dirname+'/build',
    filename: "bundle.js"
  },
  module: {
    //加载器配置
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  //插件项
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};