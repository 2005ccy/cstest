'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('./user.js');

var _user2 = _interopRequireDefault(_user);

var _token = require('./token.js');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // post 参数解析


// 用户实体操作类

// 访问token操作类


// create application/json parser
var jsonParser = _bodyParser2.default.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = _bodyParser2.default.urlencoded({
    extended: false
});

var UserRoute = function (_Base) {
    _inherits(UserRoute, _Base);

    function UserRoute(app) {
        _classCallCheck(this, UserRoute);

        var _this = _possibleConstructorReturn(this, (UserRoute.__proto__ || Object.getPrototypeOf(UserRoute)).call(this));

        _this.app = app;
        _this.init();
        return _this;
    }

    _createClass(UserRoute, [{
        key: 'init',
        value: function init() {
            // 构建依赖实体
            this.user = new _user2.default();
            this.token = new _token2.default();

            // 拦截用户非登录请求
            this.app.use(this.setReqUser);

            // ===== 用户相关操作 =====
            // 获取用户accessToken
            this.app.post('/u/accesstoken/new', jsonParser, this.user.guestAccessToken);
            // 刷新用户accessToken
            this.app.get('/u/accesstoken/refresh', this.user.refreshAccessToken);
            // 声明用户登录请求
            this.app.post('/u/login', urlencodedParser, this.user.login);
            // 声明用户注销操作
            this.app.get('/u/logout', this.user.logout);
            // 用户注册
            this.app.post('/u/registe', urlencodedParser, this.user.registe);
            // 获取注册验证码
            this.app.get('/u/captcha', this.user.getCaptcha);
            // 验证输入验证码
            this.app.post('/u/captcha', urlencodedParser, this.user.validCaptcha);
        }

        // 构建用户信息，设置中间件

    }, {
        key: 'setReqUser',
        value: function setReqUser(req, res, next) {
            // 下列请求无需验证
            if (_.includes(['/u/captcha', '/u/registe', '/u/login', '/u/accesstoken/new', '/proxy/refresh'], req.path)) {
                next();
            } else {
                // 进行用户验证
                this.token.authenticate(req, res, next);
            }
        }
    }]);

    return UserRoute;
}(Base);

exports.default = UserRoute;
//# sourceMappingURL=route.js.map