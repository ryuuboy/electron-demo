const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
  console.log(path.join(__dirname, dir));
  return path.join(__dirname, dir);
}

module.exports = {
  // 是否开启eslint保存检测，有效值：ture | false | 'error'，设定在不是生产环境（也就是开发环境使用）
  lintOnSave: !isProd,
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "public",
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.xxx.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.xxx.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: isProd ? "./" : "/",
  // 生产环境是否使用sourcemap，设定为是，这样如果有问题可以回溯到指定文件指定行数
  productionSourceMap: true,
  configureWebpack: {
    // 入口文件地址
    entry: './src/renderer/main.js',
    resolve: {
      extensions: [".js", ".vue", ".json", ".ts", ".less"],
      alias: {
        "@": resolve("src/renderer")
        // "@": resolve(__dirname, "./src/renderer")
      }
    },
    // 公共资源合并
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         chunks: "all",
    //         test: /node_modules/,
    //         name: "vendor",
    //         minChunks: 1,
    //         maxInitialRequests: 5,
    //         minSize: 0,
    //         priority: 100
    //       }
    //     },
    //     common: {
    //       chunks: "all",
    //       test: /[\\/]src[\\/]js[\\/]/,
    //       name: "common",
    //       minChunks: 2,
    //       maxInitialRequests: 5,
    //       minSize: 0,
    //       priority: 60,
    //     },
    //     styles: {
    //       name: "styles",
    //       test: /\.(sa|sc|le|c)ss$/,
    //       chunks: "all",
    //       enforce: true,
    //     },
    //     runtimeChunk: {
    //       name: "manifest",
    //     }
    //   },
    //   // 性能警告修改
    //   performance: {
    //     hints: "warning",
    //     // 入口起点的最大体积 整数类型（以字节为单位）
    //     maxEntrypointSize: 50000000,
    //     // 生成文件的最大体积 整数类型（以字节为单位 300k）
    //     maxAssetSize: 30000000,
    //     // 只给出 js 文件的性能提示
    //     assetFilter: function (assetFilename) {
    //       return assetFilename.endsWith(".js");
    //     }
    //   }
    // }
  },
  // 打包输出路径
  // outputDir: "dist/web",
  // 构建时开启多进程处理 babel 编译
  //   parallel: require('os').cpus().length > 1,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isProd,
    // 开启 CSS source maps?
    sourceMap: !isProd,
    // css预设器配置项
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#c62f2f",
          "link-color": "#c62f2f",
          "border-radius-base": "4px"
        },
        javascriptEnabled: true
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // 开发服务器http代理
  devServer: {
    open: false,
    host: "localhost",
    port: 9080,
    https: false,
    hotOnly: false
  }
};
