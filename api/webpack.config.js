const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';
const config = {
  target: 'node',
  watch: !process.env.CICD,
  entry: './src/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: [
          path.resolve(__dirname, 'coverage/'),
          path.resolve(__dirname, 'bin/'),
          path.resolve(__dirname, 'node_modules/'),
        ],
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  console.log("mode: ", config.mode);
  return config;
};
