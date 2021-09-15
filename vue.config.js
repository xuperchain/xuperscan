const path = require("path");

function resolve (dir) {
  return path.join(__dirname, dir);
}
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== "development";
const autoprefixer = require('autoprefixer')
const pxtoviewport = require('postcss-px-to-viewport')
// 本地环境是否需要使用cdn
const devNeedCdn = false;

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: "Vue",
    vuex: "Vuex",
    "vue-router": "VueRouter"
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    "https://cdn.staticfile.org/vue/2.6.10/vue.min.js",
    "https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js",
    "https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js"
  ]
};
// gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");

// 代码压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {

  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.symlinks(true);

    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("utils", resolve("src/utils"))
      .set("static", resolve("src/static"))
      .set("store", resolve("src/store"))
      .set("views", resolve("src/views"));
    // ============压缩图片 start============
    // config.module
    //   .rule('images')
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     bypassOnDebug: true
    //   })
    //   .end()
    // ============压缩图片 end============
    // ============注入cdn start============
    config.plugin("html").tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args;
    });
    // ============注入cdn start============
  },
  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals;

    // 生产环境相关配置
    if (isProduction) {
      // 代码压缩
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              // warnings: false, // 若打包错误，则注释这行
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ["console.log"]
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      //gzp压缩
      const productionGzipExtensions = ["html", "js", "css"];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), //匹配文件名
          threshold: 10240, //对10K以上的数据进行压缩
          minRatio: 0.8,
          deleteOriginalAssets: false //是否删除源文件
        })
      );

      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: "all",
              test: /node_modules/,
              name: "vendor",
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: "all",
              test: /[\\/]src[\\/]js[\\/]/,
              name: "common",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: "styles",
              test: /\.(sa|sc|c)ss$/,
              chunks: "all",
              enforce: true
            },
            runtimeChunk: {
              name: "manifest"
            }
          }
        }
      };
    }
  },

  css: {
    extract: true,
    loaderOptions: {
      less: {
    
        data: `
                   @import "@/assets/css/common.less";
                  `
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 1440
          })
        ]
      }
    }
  }
};
