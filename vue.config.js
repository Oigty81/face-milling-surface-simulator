const path = require("path");

module.exports = {
  publicPath: '',
  outputDir: process.env.VUE_APP_APPMODE === 'APP' ? path.resolve(__dirname, "../_2024/FaceMillingSurfaceSimulatorApp/Web.Resources/Frontend") : 'distweb',
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'FACE-MILLING-SURFACE-SIMULATOR';
        return args;
      });
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /renderWrapper\.wasm$/,
          type: "javascript/auto",
          loader: "file-loader",
          options: {
            name: 'js/[name].[ext]',
          }
        }
      ],
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001/',
        changeOrigin: true,
      }
    }
  }

};
