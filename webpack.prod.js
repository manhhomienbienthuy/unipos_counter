const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const devConfig = require('./webpack.dev');

module.exports = Object.assign({}, devConfig, {
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        beautify: true,
                        comments: /^ (==|@[nvdamrg]\w+)/,
                    },
                }
            }),
        ],
    },
});
