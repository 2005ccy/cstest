'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _mongo = require('../../mongo/mongo.js');

var _mongo2 = _interopRequireDefault(_mongo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // TODO 路由转发

// 导入mongo请求对象


// 代理器对象
var Proxy = function (_Base) {
    _inherits(Proxy, _Base);

    // 代理器构造方法

    // 配置的服务Map


    // 字符串分隔符
    function Proxy(app) {
        _classCallCheck(this, Proxy);

        var _this = _possibleConstructorReturn(this, (Proxy.__proto__ || Object.getPrototypeOf(Proxy)).call(this));

        _this.divide = '...';
        _this.methods = ['all', 'get', 'post', 'put', 'delete'];
        _this.serMap = {};
        _this.appMap = {};

        _this.app = app;
        _this.init();
        return _this;
    }

    // 初始化方法

    // app 发布map

    // 方法数组


    _createClass(Proxy, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            // 发布代理服务
            this.proxyPublish();
            this.app.get('/proxy/refresh', function (req, res) {
                _this2.proxyPublish();
                res.json({
                    ok: true
                });
            });
        }

        // 查询服务器列表数据

    }, {
        key: 'serverList',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var mongo;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return new _mongo2.default('server');

                            case 2:
                                mongo = _context.sent;
                                _context.next = 5;
                                return mongo.find().toArray();

                            case 5:
                                this.sers = _context.sent;

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function serverList() {
                return _ref.apply(this, arguments);
            }

            return serverList;
        }()

        // 整理代理数据

    }, {
        key: 'proxyServer',
        value: function proxyServer() {
            var _this3 = this;

            console.info('this.sers: ', this.sers);
            // 如果存在服务数据
            if (!_.isEmpty(this.sers)) {
                // 只获取，正常状态的服务
                this.sers = _.filter(this.sers, function (ser) {
                    return ser.method && ser.url && ser.status === 'normal';
                });
                // 根据路由规则，对服务器进行分组
                this.serMap = _.groupBy(this.sers, function (ser) {
                    return '' + ser.method + _this3.divide + ser.path;
                });
            }
        }

        // 代理发布服务

    }, {
        key: 'proxyPublish',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _this4 = this;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.serverList();

                            case 2:
                                // 对服务器列表进行数据转换
                                this.proxyServer();
                                // 遍历代理服务器
                                _.each(this.serMap, function (v, k) {
                                    // 如果没有发布当前路由的，中间件
                                    if (_.isUndefined(_this4.appMap[k])) {
                                        // 分解请求字符串
                                        var sa = k.split(_this4.divide);
                                        // 获取请求方法
                                        var method = _.lowerCase(sa[0] || 'all');
                                        // 排除非法方法
                                        if (!_.includes(_this4.methods, method)) {
                                            method = 'all';
                                        }
                                        // 获取请求路径
                                        var path = sa[1];
                                        // 发布路由中间件
                                        _this4.app[method](path, function (req, res, next) {
                                            // 获取当前路由列表
                                            var serList = _this4.serMap[k] || [];
                                            // 获取请求计数
                                            var now = _this4.appMap[k] + 1;
                                            // 如果大于数组长度
                                            if (now >= serList.length) {
                                                // 从第一个开始
                                                now = 0;
                                            }
                                            // 设置当前服务索引
                                            _this4.appMap[k] = now;
                                            // 获取当前服务
                                            var cur = serList[now];
                                            // 如果服务存在
                                            if (cur) {
                                                // 发起代理请求
                                                (0, _httpProxyMiddleware2.default)({
                                                    target: cur.url,
                                                    changeOrigin: true
                                                })(req, res, next);
                                            } else {
                                                // TODO 发出短信报错

                                                // 发出服务部存在，错误信息
                                                res.json({
                                                    ok: false,
                                                    code: 'SERVER_NOT_EXISTS',
                                                    msg: '服务不存在'
                                                });
                                            }
                                        });
                                        // 设置服务请求索引
                                        _this4.appMap[k] = 0;
                                    }
                                });

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function proxyPublish() {
                return _ref2.apply(this, arguments);
            }

            return proxyPublish;
        }()
    }]);

    return Proxy;
}(Base);

exports.default = Proxy;
//# sourceMappingURL=proxy.js.map