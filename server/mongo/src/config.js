'use strict';

// 导入组件
const os = require('os');
// 获得系统平台
let platform = os.platform();

// 生产环境配置项
let prod = {
    // 当前环境名称
    name: 'prod',
    // mongodb相关配置
    mongo: {
        // mongo数据库连接url
        url: 'mongodb://DB46e530d2da1f9548e329f5b391c021:4d60bf057c7a9bdc623d3d6234fe5a17@mongo.duapp.com:8908/jKfqhoWaAFPyoZTpDoPU',
    },
    // 主机地址
    host: 'http://hourly.duapp.com'
};

// 测试环境配置项
let test = {
    // 当前环境名称
    name: 'test',
    // mongodb相关配置
    mongo: {
        // mongo数据库连接url
        url: 'mongodb://DB46e530d2da1f9548e329f5b391c021:4d60bf057c7a9bdc623d3d6234fe5a17@mongo.duapp.com:8908/jKfqhoWaAFPyoZTpDoPU'
    },
    // 主机地址
    host: 'http://hourly.duapp.com'
};

// 开发环境配置项
let dev = {
    // 当前环境名称
    name: 'dev',
    // mongodb 相关配置
    mongo: {
        // mongo数据库连接url
        url: 'mongodb://localhost:27017/persiste'
    },
    // 主机地址
    host: 'http://localhost:18080'
};

// 默认配置为测试环境
let config = test;

// 开发环境标志位
global.isDevEnv = false;
// 测试环境标志位
global.isTestEnv = false;
// 生产环境标志位
global.isProdEnv = false;

// 判断环境逻辑
// 如果系统为windows 32位操作系统
if ('linux' !== platform) {
    // 环境为开发环境
    global.isDevEnv = true;
// 如果系统为linux系统
} else if ('linux' === platform) {
    // 获得系统主机名称
    let name = os.hostname();
    // 主机名存在
    if (name) {
        // 如果主机名为以下值，则为测试环境
        if ('appid6e6bye55ki' === name) {
            // 环境为测试环境
            global.isTestEnv = true;
        } else {
            // 其余情况为生产环境
            global.isProdEnv = true;
        }
    }
}
// 开发环境配置 + 日志
if (isDevEnv) {
    config = dev;
}
// 测试环境配置 + 日志
if (isTestEnv) {
    config = test;
}
// 生产环境配置 + 日志
if (isProdEnv) {
    config = prod;
}

// ============ 配置公共部分 ===================
// mongo最大连接数
config.mongo.max = 50;
// mongo最小连接数
config.mongo.min = 1;
// mongo连接回收时间(毫秒)
config.mongo.idleTimeoutMillis = 25000;
// 请求数：200000个/分钟
config.mongo.requestPreMinute = 200000;
// 流入流量：300MB/分钟
config.mongo.inputData = 1024 * 1024 * 300;
// 流出流量：600MB/分钟
config.mongo.outputData = 1024 * 1024 * 600;

// 日志相关
config.log = {
    // 日志追加器，console日志器
    appenders: [{
        type: "console",
        category: "console"
    }],
    // 百度bae 日志器，用户名与密码
    baelogOptions: {
        'user': 'e0a84b97ebf942adac240373c9733835',
        'passwd': '38c0c056bbd44922b80621a614cb41b5'
    }
};

config.get = 'get';
config.post = 'post';

// 放入全局变量
global.config = config;
// 导出环境配置信息
module.exports = config;
