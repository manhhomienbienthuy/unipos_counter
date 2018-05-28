const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        './src/js/app.js',
        './src/scss/app.scss'
    ],
    output: {
        filename: './unipos.user.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    mode: 'development',
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                // ==UserScript==
                // @name         Unipos counter
                // @version      0.0.1
                // @description  Counter for unipos point
                // @author       manhhomienbienthuy
                // @match        https://unipos.me/*
                // @run-at       document-idle
                // @grant        none
                //
                // ==/UserScript==\n
                `.replace(/^\s+/gm, ''),
            raw: true
        })
    ]
};
