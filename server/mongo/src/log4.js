'use strict';

// 导入log4js组件
const log4js = require('log4js');

//配置日志追加器
log4js.configure({
    "appenders": config.log.appenders
});

// console日志器
let log = log4js.getLogger("console");
// 百度 bae 日志器
let baelog;

// 不是开发环境，配置bae日志器
if (!isDevEnv) {
    // 加载bae 日志器
    log4js.loadAppender('baev3-log');
    // 添加bae日志器
    log4js.addAppender(log4js.appenders['baev3-log'](config.log.baelogOptions), 'baev3-log');
    // 获得bae日志器
    baelog = log4js.getLogger('baev3-log');
}
// 设置日志级别
log.setLevel('TRACE');

/**
 * [logger 全局日志对象]
 * @type {Object}
 */
global.logger = {
    // 追踪日志
    trace: (msg) => {
        // 如果消息存在
        if (msg) {
            // bae 追踪日志输出
            baelog && baelog.trace(msg);
            // 控制台 追踪日志输出
            log.trace(msg);
        }
    },
    // debug日志
    debug: (msg) => {
        // 如果消息存在
        if (msg) {
            // bae debug日志输出
            baelog && baelog.debug(msg);
            // 控制台 debug日志输出
            log.debug(msg);
        }
    },
    // 信息日志
    info: (msg) => {
        // 如果消息存在
        if (msg) {
            // bae 信息日志输出
            baelog && baelog.info(msg);
            // 控制台 信息日志输出
            log.info(msg);
        }
    },
    // 警告日志
    warn: (msg) => {
        // 如果消息存在
        if (msg) {
            // bae 警告日志输出
            baelog && baelog.warn(msg);
            // 控制台 警告日志输出
            log.warn(msg);
        }
    },
    // 错误日志
    error: (msg) => {
        // 如果消息存在
        if (msg) {
            // bae 错误日志输出
            baelog && baelog.error(msg);
            // 控制台 错误日志输出
            log.error(msg);
        }
    },
    // 致命的错误日志
    fatal: (msg) => {
        // 如果消息存在
        if (msg) {
            // bae 致命日志输出
            baelog && baelog.fatal(msg);
            // 控制台 致命日志输出
            log.fatal(msg);
        }
    }
};