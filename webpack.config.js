const fs = require("fs");
const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackConfig = {
  mode: "development",
  entry: {},
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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["dist"] },
      files: ["./dist/*"]
    })
  ],
  watch: true,
  devtool: "source-map"
};

const defaultHtmlTemplate = "<canvas>Canvas not supported</canvas>";

const getHtmlTemplate = demo => {
  let templateContent;
  try {
    templateContent = fs.readFileSync(
      path.join(__dirname, `/src/demo/${demo}/template.html`),
      { encoding: "utf8" }
    );
  } catch (x) {
    templateContent = defaultHtmlTemplate;
  }
  return templateContent;
};

const demos = ["basic", "asteroids"];
demos.forEach(demo => {
  webpackConfig.entry[demo] = `./src/demo/${demo}/index.js`;
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      chunks: [demo],
      filename: `./demo/${demo}/index.html`,
      templateContent: getHtmlTemplate(demo),
      title: demo
    })
  );
});

module.exports = webpackConfig;
