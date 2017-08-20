'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportHttpBearer = require('passport-http-bearer');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // 登录验证组件

// http参数验证组件

// 加密解密组件


// 构建请求token字符串
var Token = function (_Base) {
    _inherits(Token, _Base);

    // 构造方法
    function Token() {
        _classCallCheck(this, Token);

        var _this2 = _possibleConstructorReturn(this, (Token.__proto__ || Object.getPrototypeOf(Token)).call(this));

        _this2.loginSecret = 'secret';

        _this2.init();
        return _this2;
    }

    // 类的初始化方法


    // 构建串秘钥


    _createClass(Token, [{
        key: 'init',
        value: function init() {
            // 使用策略设置，用户信息
            _passport2.default.use(new _passportHttpBearer.Strategy(function (token, cb) {

                // 转义token
                var tobj = this.restoreToken(token);

                _jsonwebtoken2.default.verify(tobj.token, this.tokenSecret(tobj.timestamp), {
                    algorithms: ['HS256']
                }, function (err, decoded) {
                    if (err) {
                        // token 过期、或是签名错误等、尝试获取数据
                        decoded = _jsonwebtoken2.default.decode(tobj.token) || {};
                        // 登录过期
                        decoded.expired = true;
                        // 验证错误
                        // return cb(err);
                    }
                    // 输出用户信息
                    cb(null, decoded);
                });
            }));
        }

        // 构建 access_token 构建秘钥

    }, {
        key: 'tokenSecret',
        value: function tokenSecret(timestamp) {
            return timestamp + '.' + this.loginSecret;
        }

        // 转换token

    }, {
        key: 'changeToken',
        value: function changeToken(timestamp, token) {
            var ts = timestamp + '.';
            var newToken = '';
            for (var i in token) {
                newToken += token[i];
                if (ts[i]) {
                    newToken += ts[i];
                }
            }
            return newToken;
        }

        // 分离token中 token、timestamp

    }, {
        key: 'restoreToken',
        value: function restoreToken(token) {
            var ts = '';
            var t = '';
            for (var i = 0; i < token.length; i = i + 2) {
                var t2 = token[i + 1] || '';

                t += token[i];
                if (!_.endsWith(ts, '.')) {
                    ts += t2;
                } else {
                    t += t2;
                }
            }
            // 返回结果
            return {
                timestamp: ts && ts.substring(0, ts.length - 1),
                token: t
            };
        }

        // 构建更完善token

    }, {
        key: 'buildToken',
        value: function buildToken(device, user) {
            var _this = this;
            // 构建token 数据
            var userId = user._id;
            var deviceId = device._id;
            var now = Math.floor(Date.now() / 1000);
            now += device.browser ? 60 * 60 : 60 * 60 * 24 * 365;
            var data = {
                userId: userId,
                deviceId: deviceId,
                roles: user.roles,
                exp: now
            };
            // 构建时的毫秒数
            var timestamp = _.now();
            // 根据数据，生成token数据
            var t = _jsonwebtoken2.default.sign(data, this.tokenSecret(timestamp), {
                algorithm: 'HS256'
            });
            return this.changeToken(timestamp, t);
        }

        // 构建用户信息拦截中间件

    }, {
        key: 'authenticate',
        value: function authenticate(req, res, next) {
            // 进行用户验证
            _passport2.default.authenticate('bearer', {
                session: false
            })(req, res, next);
        }
    }]);

    return Token;
}(Base);

exports.default = Token;
//# sourceMappingURL=token.js.map