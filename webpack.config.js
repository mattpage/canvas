const fs = require("fs");
const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlTemplate = "<canvas>Canvas not supported</canvas>";

module.exports = {
  mode: "development",
  entry: {
    asteroids: "./src/demo/asteroids/index.js",
    basic: "./src/demo/basic/index.js"
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "./demo/[name]/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            ...JSON.parse(fs.readFileSync(path.resolve(__dirname, ".babelrc"))),
            presets: ["env"]
          }
        }
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["dist"] },
      files: ["./dist/*"]
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ["basic"],
      filename: "./demo/basic/index.html",
      templateContent: htmlTemplate,
      title: "Basic"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ["asteroids"],
      filename: "./demo/asteroids/index.html",
      templateContent: htmlTemplate,
      title: "Asteroids"
    })
  ],
  watch: true,
  devtool: "source-map"
};
