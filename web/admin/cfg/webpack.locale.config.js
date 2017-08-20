const fs = require('fs');
const path = require("path");
const webpack = require('webpack');
const exec = require('child_process').exec;

module.exports = {
    entry: {
        'ja': path.resolve(__dirname, 'locale/ja/index.js')
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './__locale__'),
        publicPath: '/__locale__/',
        library: 'csI18nContent',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        // 对文件进行压缩
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        }),
        //删除过期文件
        function() {

            var INDEX_FILE = path.resolve(__dirname, './index.html');
            var LOCAL_PATH = path.resolve(__dirname, './__locale__/');

            // 删除过期的 shared 文件
            exec(`rm -rf ${LOCAL_PATH}/*`, function(err, out) {
                console.log(out);
                err && console.log(err);
            });

            // 插件执行完毕
            this.plugin('done', stats => {
                // 读取 首页 html
                fs.readFile(INDEX_FILE, (err, data) => {
                    // 获得 html 文本
                    var html = data.toString();
                    //替换page文本
                    html = html.replace(/\/__locale__\/ja\.(.+?)\.js/g, `/__locale__/ja.${stats.hash}.js`);
                    // 将新值，重写入首页
                    fs.writeFile(INDEX_FILE, html, err => {
                        !err && console.log('Set has success: ' + stats.hash);
                    });
                });
            });
        }
    ]
};
