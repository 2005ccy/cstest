const fs = require('fs');
const path = require("path");
const webpack = require('webpack');
const WebpackBrowserPlugin = require('webpack-browser-plugin');
const exec = require('child_process').exec;
const configServer = require('./configServer');

var webpackConfig = function() {
    var r = {};

    // CDN 加载的外部文件
    var externals = () => {
        return {
            // react 使用cdn加载
            'react': 'React',
            // react-dom 使用cdn加载
            'react-dom': 'ReactDOM',
            // react 路由
            'react-router': 'ReactRouter',
            // jquery组件
            'jquery': 'jQuery'
        }
    }

    var webExternals = () => {
        var we = externals();
        we['antd'] = 'antd';
        return we;
    }

    var mobileExternals = () => {
        var me = externals();
        me['antd-mobile'] = "window['antd-mobile']";
        return me;
    }

    var module = () => {
        return {
            loaders: [{
                test: /\.css$/,
                loader: "classnames!style!css"
            }, {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel']
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=5000&name=/img/[hash:8].[name].[ext]'
                ]
            }]
        }
    }

    var devPlugins = () => {
        return [
            //自动刷新
            new webpack.HotModuleReplacementPlugin(),
            //添加备注
            new webpack.BannerPlugin('develop for changeSoft'),
            // 自动打开浏览器
            new WebpackBrowserPlugin({
                browser: 'Chrome'
            })
        ]
    }

    var devServer = () => {
        return {
            host: '0.0.0.0',
            contentBase: [path.resolve(__dirname, '../../'), path.resolve(__dirname, '../../cfg/')],
            stats: {
                colors: true
            },
            hot: true,
            inline: true,
            proxy: {
                '/v2/**': {
                    target: configServer.step,
                    secure: false,
                    changeOrigin: true
                },
                '/stepapi/v3/**': {
                    target: configServer.work,
                    secure: false,
                    changeOrigin: true
                },
                '/api/user/logout': {
                    target: configServer.sso,
                    secure: false,
                    changeOrigin: true
                },
                '/api/oauth/token': {
                    target: configServer.sso,
                    secure: false,
                    changeOrigin: true
                }
            }
        }
    }

    var webDevServer = () => {
        var wds = devServer();
        wds['port'] = 3000;
        return wds;
    }

    var mobileDevServer = () => {
        var mds = devServer();
        mds['port'] = 3001;
        return mds;
    }

    var devModule = () => {
        return {
            loaders: [{
                test: /\.css$/,
                loader: "style!css"
            }, {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel']
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=5000&name=/img/[hash:8].[name].[ext]'
                ]
            }]
        }
    }

    var webDevOutput = () => {
        return {
            path: path.resolve(__dirname, '../../build'),
            filename: "[name].js"
        }
    }

    var mobileDevOutput = () => {
        return {
            path: path.resolve(__dirname, '../../mbuild'),
            filename: "bundle.js"
        }
    }

    var webDevEntry = () => {
        return {
            web: [
                'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
                'webpack/hot/only-dev-server',
                path.resolve(__dirname, '../../src/entry.js')
            ],
            ja: './cfg/locale/ja/index.js'
        }
    }

    var mobileDevEntry = () => {
        return [
            'webpack-dev-server/client?http://0.0.0.0:3001', // WebpackDevServer host and port
            'webpack/hot/only-dev-server',
            './mentry.js'
        ]
    }

    var devTool = () => {
        return 'inline-source-map';
    }

    var resolve = () => {
        return {
            alias: {
                'component': path.resolve(__dirname, '../components/index.js'),
                'common': path.resolve(__dirname, '../../common/'),
                'pages': path.resolve(__dirname, '../../src/pages'),
                'widgets': path.resolve(__dirname, '../../src/widgets')
            }
        }
    }

    r.webDevConfig = () => {
        var wdc = {};
        wdc['externals'] = webExternals();
        wdc['plugins'] = devPlugins();
        wdc['devServer'] = webDevServer();
        wdc['module'] = devModule();
        wdc['output'] = webDevOutput();
        wdc['entry'] = webDevEntry();
        wdc['devtool'] = devTool();
        wdc['resolve'] = resolve();
        return wdc;
    };

    r.mobileDevConfig = () => {
        var mdc = {};
        mdc['externals'] = mobileExternals();
        mdc['plugins'] = devPlugins();
        mdc['devServer'] = mobileDevServer();
        mdc['module'] = devModule();
        mdc['output'] = mobileDevOutput();
        mdc['entry'] = mobileDevEntry();
        mdc['devtool'] = devTool();
        mdc['resolve'] = resolve();
        return mdc;
    };

    var prodPlugins = (pp) => {
        return [
            //共享文件
            new webpack.optimize.CommonsChunkPlugin(pp[0]),
            // 根据文件大小排序
            new webpack.optimize.OccurrenceOrderPlugin(),
            // 对文件进行压缩
            new webpack.optimize.UglifyJsPlugin({
                minimize: true
            }),
            // 删除重复依赖包
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
            }),

            //删除过期文件
            function() {

                var INDEX_FILE = path.resolve(__dirname, '../../cfg/index.html');

                // 删除过期的 shared 文件
                exec('rm -rf ' + pp[1], function(err, out) {
                    console.log(out);
                    err && console.log(err);
                });
                exec('rm -rf ' + pp[2], function(err, out) {
                    console.log(out);
                    err && console.log(err);
                });

                // 插件执行完毕
                this.plugin('done', stats => {

                    console.error('webpack plugin done: ' + JSON.stringify(arguments));
                    // 读取 首页 html
                    fs.readFile(INDEX_FILE, (err, data) => {
                        // 获得 html 文本
                        var html = data.toString();
                        // 替换 shared.hash.js 文本
                        html = html.replace(pp[3], pp[4] + stats.hash + '.js');
                        //替换page文本
                        html = html.replace(pp[5], pp[6] + stats.hash + '.page.js');
                        // 将新值，重写入首页
                        fs.writeFile(INDEX_FILE, html, err => {
                            !err && console.log('Set has success: ' + stats.hash);
                        });
                    });
                });
            }
        ];
    }

    r.webProdPlugins = () => {
        var BUILD_PATH = path.resolve(__dirname, '../../cfg/__web__/');
        return prodPlugins([
            'webshared.[hash].js',
            BUILD_PATH + '/*',
            BUILD_PATH + '/*',
            /webshared\.[^\.]+\.js/,
            'webshared.',
            /\/__web__\/web\.(.+?)\.page\.js/g,
            '/__web__/web.'
        ]);
    }

    r.mobileProdPlugins = () => {
        var BUILD_PATH = path.resolve(__dirname, '../../cfg/__mobile__/');
        return prodPlugins([
            'mobileshared.[hash].js',
            BUILD_PATH + '/*',
            BUILD_PATH + '/*',
            /mobileshared\.[^\.]+\.js/,
            'mobileshared.',
            /\/__mobile__\/mobile\.(.+?)\.page\.js/g,
            '/__mobile__/mobile.'
        ]);
    }

    var prodNode = () => {
        var ret = {};
        ret[path.resolve(__dirname, '../../cfg')] = true;
        return ret;
    }

    var prodContext = () => {
        return path.resolve(__dirname, '../../cfg');
    }

    var prodModule = () => {
        return {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=5000&name=/img/[hash:8].[name].[ext]'
                ]
            }]
        }
    }

    var prodOutput = () => {
        return {
            filename: '[name].[hash].page.js',
            chunkFilename: '[id].[chunkhash].chunk.js',
        }
    }

    var webProdOutput = () => {
        var wpo = prodOutput();
        wpo['path'] = path.resolve(__dirname, '../../cfg/__web__');
        wpo['publicPath'] = '/__web__/';
        return wpo;
    }

    var mobileProdOutput = () => {
        var mpo = prodOutput();
        mpo['path'] = path.resolve(__dirname, '../../cfg/__mobile__');
        mpo['publicPath'] = '/__mobile__/';
        return mpo;
    }

    var webProdEntry = () => {
        return {
            'web': [
                path.resolve(__dirname, '../../src/config/app.js')
            ]
        };
    }

    var mobileProdEntry = () => {
        return {
            'web': [
                path.resolve(__dirname, '../../msrc/config/app.js')
            ]
        };
    }

    r.webProdConfig = () => {
        var wpc = {};
        wpc['externals'] = webExternals();
        wpc['plugins'] = r.webProdPlugins();
        wpc['node'] = prodNode();
        wpc['context'] = prodContext();
        wpc['module'] = prodModule();
        wpc['output'] = webProdOutput();
        wpc['entry'] = webProdEntry();
        wpc['resolve'] = resolve();
        // wpc['devtool'] = devTool();
        return wpc;
    };

    r.mobileProdConfig = () => {
        var mpc = {};
        mpc['externals'] = mobileExternals();
        mpc['plugins'] = r.mobileProdPlugins();
        mpc['node'] = prodNode();
        mpc['context'] = prodContext();
        mpc['module'] = prodModule();
        mpc['output'] = mobileProdOutput();
        mpc['entry'] = mobileProdEntry();
        mpc['resolve'] = resolve();
        return mpc;
    };

    return r;
}

module.exports = new webpackConfig();
