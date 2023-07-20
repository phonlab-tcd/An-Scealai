const path = require("path");
const env = process.env.NODE_ENV || "dev";
const isProduction = env == "production";
console.log(env);

const config = {
  devtool: false,
  target: "node",
  entry: "./src/server.ts",
  output: {
    filename: `${env}-server.js`,
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: [
          path.resolve(__dirname, "coverage/"),
          path.resolve(__dirname, "bin/"),
          path.resolve(__dirname, "node_modules/"),
        ],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
    if(process.env.watch) config.watch = eval(process.env.watch);
    else config.watch = true;
  }
  return config;
};
