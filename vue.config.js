module.exports = {
  publicPath: '',
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
};
