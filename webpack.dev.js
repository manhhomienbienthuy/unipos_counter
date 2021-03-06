const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [
        './src/js/app.js',
    ],
    output: {
        filename: './unipos.user.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            },
        ]
    },
    mode: 'development',
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                // ==UserScript==
                // @name         Unipos counter
                // @version      1.2
                // @description  Counter for unipos point
                // @author       manhhomienbienthuy
                // @match        https://unipos.me/*
                // @run-at       document-idle
                // @grant        none
                // ==/UserScript==
                `.replace(/^\s+/gm, ''),
            raw: true
        }),
    ]
};
