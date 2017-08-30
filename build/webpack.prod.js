var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    devtool: "source-map",

    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'bundle.[chunkhash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                // test: /\.css$/,
                // use: [
                //     'style-loader',
                //     'css-loader'
                // ]
                test: /\.css$/,
                use: ExtractTextPlugin.extract({use: 'css-loader'})
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
        new ExtractTextPlugin('styles.[chunkhash].css'),
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