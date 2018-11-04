const fs = require("fs");
const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackConfig = {
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
        include: path.resolve(__dirname, "src/demo/asteroids"),
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src/demo/basic"),
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src/demo/balls"),
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./demo/[name]/[name].css",
      chunkFilename: "[id].css"
    }),
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["dist"] },
      files: ["./dist/*"]
    })
  ]
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

const demos = ["basic", "asteroids", "balls"];
demos.forEach(demo => {
  webpackConfig.entry[demo] = `./src/demo/${demo}/index.js`;
  webpackConfig.plugins.push(
    new CopyWebpackPlugin(
      [
        {
          from: path.join(__dirname, `/src/demo/${demo}/assets`),
          to: `./demo/${demo}/assets`,
          toType: "dir"
        }
      ],
      {}
    ),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: [demo],
      filename: `./demo/${demo}/index.html`,
      templateContent: getHtmlTemplate(demo),
      title: demo
    })
  );
});

module.exports = (env, argv) => {
  webpackConfig.mode = argv.mode || "production";
  if (argv.mode === "development") {
    webpackConfig.devtool = "source-map";
    webpackConfig.watch = true;
  }
  return webpackConfig;
};
