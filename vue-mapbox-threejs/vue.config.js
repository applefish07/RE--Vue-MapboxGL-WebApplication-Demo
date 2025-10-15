const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Introducing CopyWebpackPlugin

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.exclude.add(path.resolve('src/assets/icons')); // Exclude icons folder

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve('src/assets/icons')) // Specify the directory to be processed
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]', // Custom symbol ID
      });
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'db.json'), // Source file path
            to: path.resolve(__dirname, 'public/db.json'), // target path
            noErrorOnMissing: true, // No error will be reported if the file is missing
            force: true, // compulsory coverage
          },
        ],
      }),
    ],
  },
});
