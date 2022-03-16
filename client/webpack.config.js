const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: path.join(__dirname, "src", "index.jsx"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      favicon: path.join(__dirname, "public", "favicon.ico"),
      manifest: path.join(__dirname, "public", "manifest.json"),
    }),
    new WebpackBundleAnalyzer({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", ["@babel/preset-react", { "runtime": "automatic" }]]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader",
        options: {
          name: "./public/[name].[ext]"
        }
      }
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  mode: "development",
  devServer: {
    historyApiFallback: true,
  }
};