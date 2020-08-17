/**
 * @file
 */

const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PortalWebFonts = require('./portal-webfonts')

const argv = require('minimist')(process.argv)
const dev = argv.mode === 'development'

const configEntryOutput =
  argv.cible === 'base'
    ? require('./webpack/webpack.base-themes.config')
    : require('./webpack/webpack.sites-themes.config')

const styleLoader = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      sourceMap: dev,
    },
  },
]

let configWebpack = {
  ...configEntryOutput,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: styleLoader,
      },
      {
        test: /\.scss$/,
        use: [
          ...styleLoader,
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: dev,
              config: {
                path: 'postcss.config.js',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: dev },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: dev,
              resources: [
                './web/themes/custom/*/src/scss/utilities/_variables.scss',
                './web/themes/custom/*/src/scss/utilities/_mixins.scss',
                './web/sites/*/themes/custom/*/src/scss/utilities/_variables.scss',
                './web/sites/*/themes/custom/*/src/scss/utilities/_mixins.scss',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[ext][query]',
              outputPath: (url, resourcePath, context) => {
                let relativePath = path.relative(context, resourcePath)
                relativePath = relativePath.replace('web/themes/custom/', '')
                relativePath = relativePath.replace('web/sites/', '')
                return relativePath
              },
            },
          },
          {
            loader: 'img-loader',
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext][query]',
          outputPath: (url, resourcePath, context) => {
            let relativePath = path.relative(context, resourcePath)
            relativePath = relativePath.replace('web/themes/custom/', '')
            relativePath = relativePath.replace('web/sites/', '')
            return relativePath
          },
        },
      },
    ],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap('Generate webfonts', (compilation) => {
          PortalWebFonts()
        })
      },
    },
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  watch: dev,
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'cheap-module-source-map' : false,
  optimization: {
    minimizer: [],
  },
}

if (!dev) {
  configWebpack.optimization.minimizer.push(new UglifyJsPlugin())
  configWebpack.plugins.push(
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    })
  )
}

module.exports = configWebpack
