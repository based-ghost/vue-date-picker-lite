const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/components/DatePickerLite.vue',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'date-picker-lite.js',
        library: 'DatePickerLite',
        libraryExport: 'default',
        libraryTarget: 'umd',
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [
		    {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src')
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            })
        ]
    },
    performance: {
        hints: false
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
        isProduction && new webpack.optimize.AggressiveMergingPlugin(),
        isProduction && new MiniCssExtractPlugin({filename: 'datePickerLiteStye.css'})		
    ].filter(i => i)
};