var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack');

module.exports = {

    devtool: "source-map",

    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            { test: /\.html$/, use: ['raw-loader']}
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            inject: 'body'
        })

    ]

};