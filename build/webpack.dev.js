var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');
    // extractCSS = new ExtractTextPlugin('./[name].css');

module.exports = {

    devtool: "cheap-eval-source-map",

    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'bundle.[hash].js',
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
        // extractCSS,
        
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            inject: 'body'
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.HotModuleReplacementPlugin()// 启用 HMR
    ],
    devServer: {    //设置本地Server;
        disableHostCheck: true,
        contentBase: path.join(__dirname, '../dist'),  //设置启动文件目录;
        publicPath: '/',
        port: 3000,      //设置端口号；
        compress: true, //设置gzip压缩;
        inline: true,  //开启更新客户端入口(可在package.json scripts 里设置 npm run xxx);
        hot: true    //设置热更新(可在package.json scripts 里设置 npm run xxx);
    }
};