'use strict';

// 导入log4js组件
import log4js from 'log4js';

export default class Logger {

    constructor() {
        this.init();
    }

    // 初始化类
    init() {
        //配置日志追加器
        log4js.configure({
            "appenders": config.log.appenders
        });

        // console日志器
        this.log = log4js.getLogger("console");
        // 设置日志级别
        this.log.setLevel('TRACE');
        // 设置bae日志对象
        this.baeLog();
    }

    baeLog() {
        // 不是开发环境，配置bae日志器
        if (!isDevEnv) {
            // 加载bae 日志器
            log4js.loadAppender('baev3-log');
            // 添加bae日志器
            log4js.addAppender(log4js.appenders['baev3-log'](config.log.baelogOptions), 'baev3-log');
            // 获得bae日志器
            this.baelog = log4js.getLogger('baev3-log');
        }
    }

    // 构建
    getMsg(msg) {
        let size = _.size(msg);
        if (0 == size) {
            return;
        } else if (1 == size) {
            return msg[0];
        } else {
            return _.join(msg, '\n; ');
        }
    }

    // 追踪日志
    trace(...msg) {
        // 构建输出消息
        let m = this.getMsg(msg);
        // 如果消息存在
        if (m) {
            // bae 追踪日志输出
            baelog && baelog.trace(m);
            // 控制台 追踪日志输出
            log.trace(m);
        }
    }

    // debug日志
    debug(...msg) {
        // 构建输出消息
        let m = this.getMsg(msg);
        // 如果消息存在
        if (m) {
            // bae debug日志输出
            baelog && baelog.debug(m);
            // 控制台 debug日志输出
            log.debug(m);
        }
    }

    // 信息日志
    info(...msg) {
        // 构建输出消息
        let m = this.getMsg(msg);
        // 如果消息存在
        if (m) {
            // bae 信息日志输出
            baelog && baelog.info(m);
            // 控制台 信息日志输出
            log.info(m);
        }
    }

    // 警告日志
    warn(...msg) {
        // 构建输出消息
        let m = this.getMsg(msg);
        // 如果消息存在
        if (m) {
            // bae 警告日志输出
            baelog && baelog.warn(m);
            // 控制台 警告日志输出
            log.warn(m);
        }
    }

    // 错误日志
    error(...msg) {
        // 构建输出消息
        let m = this.getMsg(msg);
        // 如果消息存在
        if (m) {
            // bae 错误日志输出
            baelog && baelog.error(m);
            // 控制台 错误日志输出
            log.error(m);
        }
    }

    // 致命的错误日志
    fatal(...msg) {
        // 构建输出消息
        let m = this.getMsg(msg);
        // 如果消息存在
        if (m) {
            // bae 致命日志输出
            baelog && baelog.fatal(m);
            // 控制台 致命日志输出
            log.fatal(m);
        }
    }

}
// 定义全局日志对象
global.logger = new Logger();