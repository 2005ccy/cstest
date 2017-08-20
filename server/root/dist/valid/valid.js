'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 权限验证类
var Valid = function (_Base) {
    _inherits(Valid, _Base);

    // 构造方法


    // 成员信息描述
    function Valid(app) {
        _classCallCheck(this, Valid);

        var _this = _possibleConstructorReturn(this, (Valid.__proto__ || Object.getPrototypeOf(Valid)).call(this));

        _this.data = [{
            name: 'server', // 服务器数据
            organiz: 'system', // 系统
            all: ['admin'] // 所有操作 'admin' 角色
        }, {
            name: 'product', // 产品数据
            organiz: 'custom', // 自定义
            get: {
                guest: ['name', 'price', '']
            }
        }, {
            name: 'role', // 角色表
            organiz: 'custom', // 自定义组织
            all: ['admin'] }];
        _this.user = {
            organiz: 'company.hr', // 公司人事部
            roles: ['admin']
        };
        _this.roles = [{
            method: 'all', // [all, get, post, put, delete]
            path: '/p/server',
            roles: ['admin'],
            paramRule: {
                name: [{}]
            }
        }];

        _this.app = app;
        init();
        return _this;
    }

    // 初始化方法


    // 访问路径配置数据


    // 数据描述


    _createClass(Valid, [{
        key: 'init',
        value: function init() {
            // 权限验证中间件
            this.app.use(function (req, res, next) {
                // 分解请求url
                var ps = req.path.split('/');
                // 获取访问标识
                var tag = ps[1];
                // 获取集合名称
                var col = ps[2];
                // 免登陆访问
                if (tag === 'u') {
                    next();
                    // 需登录访问
                } else {}
                next();
            });
        }
    }]);

    return Valid;
}(Base);

exports.default = Valid;
//# sourceMappingURL=valid.js.map