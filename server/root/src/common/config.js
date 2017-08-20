// 导入组件
import os from 'os';

// 获得系统平台
const platform = os.platform();

// 公共配置相关类
export default class Config {

    // 生产环境配置项
    prod = {
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
    test = {
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
    dev = {
        // 当前环境名称
        name: 'dev',
        // mongodb 相关配置
        mongo: {
            // mongo数据库连接url
            url: 'mongodb://127.0.0.1:27017/persiste'
        },
        // 主机地址
        host: 'http://127.0.0.1:18080'
    };

    // 公共配置信息
    common = {
        mongo: {
            max: 50,
            // mongo最小连接数
            min: 1,
            // mongo连接回收时间(毫秒)
            idleTimeoutMillis: 25000,
            // 请求数：200000个/分钟
            requestPreMinute: 200000,
            // 流入流量：300MB/分钟
            inputData: 1024 * 1024 * 300,
            // 流出流量：600MB/分钟
            outputData: 1024 * 1024 * 600,
        },
        log: {
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
        }
    };

    constructor() {
        this.init();
    }

    init() {
        // 全局配置文件
        global.config = this.test;

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
                if ('appidf57w8ena46' === name) {
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
            config = this.dev;
        }
        // 测试环境配置 + 日志
        if (isTestEnv) {
            config = this.test;
        }
        // 生产环境配置 + 日志
        if (isProdEnv) {
            config = this.prod;
        }
        // 再次追加公共部分
        _.extend(config, this.common);
    }
}
// 构建公共配置对象
new Config();