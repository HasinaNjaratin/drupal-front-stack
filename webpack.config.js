const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')


// Utility variables.
const argv = require('minimist')
const dev = argv.mode === 'development'

const style_loader = [
    MiniCssExtractPlugin,
    {
        loader: 'css-loader',
        options: {
            importLoaders: 1,
            sourceMap: dev
        }
    }
]

// Your specific conf here.
const theme_name = 'mycustomtheme'
const path_to_theme_dir = 'www/themes/custom'

let configWebpack = {
    // Then if you have to manage more theme, you can add items entry here.
    entry: {
        'mycustomtheme/build/bundle': `./${path_to_theme_dir}/${theme_name}/assets/app.js`,
    },
    output: {
        path: path.resolve(`./${path_to_theme_dir}/`),
        filename: '[name].js',
        publicPath: '/themes/custom'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: style_loader
            },
            {
                test: /\.scss$/,
                use: [
                    ...style_loader,
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: dev,
                            config : {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: dev }         
                    },
                    {
                        loader: 'sass-ressources-loader',
                        options: {
                            sourceMap: dev,
                            ressources: [
                                `./${path_to_theme_dir}/${theme_name}/assets/scss/utilities/_variables.scss`,
                                `./${path_to_theme_dir}/${theme_name}/assets/scss/utilities/_mixins.scss`
                            ]
                        }
                    }
                ]
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
                                const relativePath = path.relative(context, resourcePath);
                                return relativePath.replace(`${path_to_theme_dir}/`, '')
                            }
                        }
                    },
                    {
                        loader: 'img-loader'
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext][query]',
                    outputPath: (url, resourcePath, context) => {
                        const relativePath = path.relative(context, resourcePath);
                        return relativePath.replace(`${path_to_theme_dir}/`, '')
                    }
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('css-nano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true }}]
            }
        })
    ],
    optimization: {
        minimizer: []
    },
    watch: dev,
    devtool: dev ? 'cheap-module-source-map' : false,
    mode: dev ? 'development' : 'production'
}

if(!dev){
    configWebpack.optimization.minimizer.push(new UglifyJsPlugin())
}

module.exports = configWebpack