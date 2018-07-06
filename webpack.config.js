'use strict'
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackAutoInjectVersion = require('webpack-auto-inject-version')

let config = {
    mode: 'development',
    entry: {
        javascript: './src/app/index.module.js'
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'scripts/bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: [
                  { loader: 'babel-loader', options: { presets: [ 'env', 'react' ] } },
                  { loader: 'eslint-loader', options: { envs: ['commonjs'], failOnWarning: true, failOnError: true } },
                ]
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: [
                  { loader: 'babel-loader', options: { presets: [ 'env', 'react' ] } },
                  { loader: 'eslint-loader', options: { envs: ['commonjs'], failOnWarning: true, failOnError: true } },
                ]
            },
            {
                test: /\.html$/,
                exclude: [
                  path.resolve(__dirname, 'src/index.html'),
                ],
                use: [
                    { loader: "ngtemplate-loader", query: { relativeTo: 'src/app/' } },
                    { loader: "html-loader" }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }, // translates CSS into CommonJS
                ]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?name=fonts/[name].[ext]&limit=10000',
            },
            {
                test: /\.(ttf|eot|svg|otf)(\?[\s\S]+)?$/,
                use: 'file-loader?name=fonts/[name].[ext]',
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }, // translates CSS into CommonJS
                    { loader: "sass-loader" } // compiles Sass to CSS
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'angular-santize': 'angular-sanitize/angular-sanitize.js'
        }
    },
    devtool: 'source-map',
    plugins: [
        // needs to go first to insert the file in js
        new WebpackAutoInjectVersion({
          components: {
            AutoIncreaseVersion: false,
            InjectAsComment: false,
            InjectByTag: true
          }
        }),
        // the html, which will have the bundle.js script tag injected
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'head'
        }),
        // copy static assets
        new CopyWebpackPlugin([
            { from: 'src/lib/d3-heatmap2', to: 'lib/d3-heatmap2' },
            { from: 'src/favicon.ico', to: 'favicon.ico' },
            { from: 'vector.png', to: 'assets/images/vector_owl.png' }
        ]),
        // configure jquery, needed by angular and other components that assume jQuery or other strings
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            moment: 'moment',
            '_': 'lodash'
        }),
    ]
}

module.exports = config
