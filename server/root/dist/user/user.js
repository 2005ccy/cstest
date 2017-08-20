'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sha = require('crypto-js/sha256');

var _sha2 = _interopRequireDefault(_sha);

var _svgCaptcha = require('svg-captcha');

var _svgCaptcha2 = _interopRequireDefault(_svgCaptcha);

var _token = require('./token.js');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// 生成加密字符串

// svg 验证码

// 加载accessToken组件


var token = new _token2.default();

// 用户相关操作类

var User = function (_Base) {
    _inherits(User, _Base);

    // 构造方法
    function User() {
        _classCallCheck(this, User);

        var _this = _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this));

        _this.pwdSecret = 'pwd.timestamp.sha256';
        return _this;
    }

    // 创建设备数据


    // 密码加密密钥


    _createClass(User, [{
        key: 'saveDevice',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(device) {
                var mongo;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return new Mongo('device');

                            case 2:
                                mongo = _context.sent;
                                _context.next = 5;
                                return mongo.insert(device);

                            case 5:
                                return _context.abrupt('return', _context.sent);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function saveDevice(_x) {
                return _ref.apply(this, arguments);
            }

            return saveDevice;
        }()

        // 创建访客用户

    }, {
        key: 'saveGuest',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(guest) {
                var mongo;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return new Mongo('guest');

                            case 2:
                                mongo = _context2.sent;
                                _context2.next = 5;
                                return mongo.insert(guest);

                            case 5:
                                return _context2.abrupt('return', _context2.sent);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function saveGuest(_x2) {
                return _ref2.apply(this, arguments);
            }

            return saveGuest;
        }()

        // 生成游客accessToken

    }, {
        key: 'guestAccessToken',
        value: function guestAccessToken(req, res) {

            // 获得设备信息
            var device = req.body;
            // 设置设备唯一编号
            device._id = _.now() + '.system.device';

            // 构建用户数据
            var user = {
                _id: _.now() + '.system.guest',
                roles: ['guest'],
                devices: [device._id],
                address: device.address
            };

            // 保存设备信息
            var ret = this.saveDevice(device);
            // 保存游客信息
            ret = ret && this.saveGuest(user);
            // 构建token访问字符串
            ret = ret && token.buildToken(device, user);
            // 输出结果
            this.response(res, ret);
        }

        // 刷新当前 access_token

    }, {
        key: 'refreshAccessToken',
        value: function refreshAccessToken(req, res) {}
        // 获取access_token

        // 如果有效，产生一个新的access_token

        // 用户注册

    }, {
        key: 'registe',
        value: function registe(req, res) {

            if (!this.checkCaptcha(req.body.captcha)) {
                res.json({
                    ok: false,
                    code: 'CAPTCHA_ERROR',
                    msg: '验证码错误'
                });
                return;
            }

            var ts = _.now();
            // 获取注册数据
            var data = _.extend({
                timestamp: ts
            }, req.body);

            data._id = ts + '.' + (data.mobile || data.email);
            data.password = this.crypto(data.password, data.timestamp);
            delete data.captcha;
            delete data.agreement;
            delete data.confirm;

            // 构建mongo实例
            var mongo = new Mongo('users');
            // 向数据库插入数据
            mongo.insert(data, res);
        }

        // 密码加密算法

    }, {
        key: 'crypto',
        value: function crypto(pwd, now) {
            return (0, _sha2.default)(pwd + '.' + pwdSecret + '.' + now).toString();
        }

        // 检查验证码是否相同

    }, {
        key: 'checkCaptcha',
        value: function checkCaptcha(captcha) {
            var reg = new RegExp('^' + captcha + '$', "i");
            return false;
        }

        // 验证输入验证码

    }, {
        key: 'validCaptcha',
        value: function validCaptcha(req, res) {
            var c = req.params.captcha;

            var r = {
                ok: true
            };
            if (!this.checkCaptcha(c)) {
                r = {
                    ok: false
                };
            }
            res.status(200).json(r);
        }

        // 获取注册验证码

    }, {
        key: 'getCaptcha',
        value: function getCaptcha(req, res) {
            var opt = {
                size: 4,
                ignoreChars: '0o1i',
                noise: 3
            };
            var captcha = _svgCaptcha2.default.create(opt);

            // res.set('Content-Type', 'image/svg+xml');
            res.status(200).send(captcha.data);
        }

        // 完成用户登录

    }, {
        key: 'login',
        value: function login(req, res) {
            // 1. 获取用户名、密码

            // 2. 判断用户名，类型（用户名、邮箱、手机）

            // 3. 查询用户数据

            // 4. 比对用户密码

            // 5. 登录成功，返回access_token

            // 构建访问token, 
            var token = this.buildToken(data);
            // 写出登录成功token
            res.json({
                ok: true,
                access_token: token
            });
        }

        // 完成用户登出

    }, {
        key: 'logout',
        value: function logout(req, res) {
            req.logout();
            res.redirect('/');
        }
    }]);

    return User;
}(Base);

exports.default = User;
//# sourceMappingURL=user.js.map