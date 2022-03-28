const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
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
      new webpack.DefinePlugin(envKeys),
    ],
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "src/components"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@pages": path.resolve(__dirname, "src/pages"),
      }
    },
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
};