'use strict';

// 导入log4js组件

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);

        this.init();
    }

    // 初始化类


    _createClass(Logger, [{
        key: 'init',
        value: function init() {
            //配置日志追加器
            _log4js2.default.configure({
                "appenders": config.log.appenders
            });

            // console日志器
            this.log = _log4js2.default.getLogger("console");
            // 设置日志级别
            this.log.setLevel('TRACE');
            // 设置bae日志对象
            this.baeLog();
        }
    }, {
        key: 'baeLog',
        value: function baeLog() {
            // 不是开发环境，配置bae日志器
            if (!isDevEnv) {
                // 加载bae 日志器
                _log4js2.default.loadAppender('baev3-log');
                // 添加bae日志器
                _log4js2.default.addAppender(_log4js2.default.appenders['baev3-log'](config.log.baelogOptions), 'baev3-log');
                // 获得bae日志器
                this.baelog = _log4js2.default.getLogger('baev3-log');
            }
        }

        // 构建

    }, {
        key: 'getMsg',
        value: function getMsg(msg) {
            var size = _.size(msg);
            if (0 == size) {
                return;
            } else if (1 == size) {
                return msg[0];
            } else {
                return _.join(msg, '\n; ');
            }
        }

        // 追踪日志

    }, {
        key: 'trace',
        value: function trace() {
            for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
                msg[_key] = arguments[_key];
            }

            // 构建输出消息
            var m = this.getMsg(msg);
            // 如果消息存在
            if (m) {
                // bae 追踪日志输出
                baelog && baelog.trace(m);
                // 控制台 追踪日志输出
                log.trace(m);
            }
        }

        // debug日志

    }, {
        key: 'debug',
        value: function debug() {
            for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                msg[_key2] = arguments[_key2];
            }

            // 构建输出消息
            var m = this.getMsg(msg);
            // 如果消息存在
            if (m) {
                // bae debug日志输出
                baelog && baelog.debug(m);
                // 控制台 debug日志输出
                log.debug(m);
            }
        }

        // 信息日志

    }, {
        key: 'info',
        value: function info() {
            for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                msg[_key3] = arguments[_key3];
            }

            // 构建输出消息
            var m = this.getMsg(msg);
            // 如果消息存在
            if (m) {
                // bae 信息日志输出
                baelog && baelog.info(m);
                // 控制台 信息日志输出
                log.info(m);
            }
        }

        // 警告日志

    }, {
        key: 'warn',
        value: function warn() {
            for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                msg[_key4] = arguments[_key4];
            }

            // 构建输出消息
            var m = this.getMsg(msg);
            // 如果消息存在
            if (m) {
                // bae 警告日志输出
                baelog && baelog.warn(m);
                // 控制台 警告日志输出
                log.warn(m);
            }
        }

        // 错误日志

    }, {
        key: 'error',
        value: function error() {
            for (var _len5 = arguments.length, msg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                msg[_key5] = arguments[_key5];
            }

            // 构建输出消息
            var m = this.getMsg(msg);
            // 如果消息存在
            if (m) {
                // bae 错误日志输出
                baelog && baelog.error(m);
                // 控制台 错误日志输出
                log.error(m);
            }
        }

        // 致命的错误日志

    }, {
        key: 'fatal',
        value: function fatal() {
            for (var _len6 = arguments.length, msg = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                msg[_key6] = arguments[_key6];
            }

            // 构建输出消息
            var m = this.getMsg(msg);
            // 如果消息存在
            if (m) {
                // bae 致命日志输出
                baelog && baelog.fatal(m);
                // 控制台 致命日志输出
                log.fatal(m);
            }
        }
    }]);

    return Logger;
}();
// 定义全局日志对象


exports.default = Logger;
global.logger = new Logger();
//# sourceMappingURL=log4.js.map