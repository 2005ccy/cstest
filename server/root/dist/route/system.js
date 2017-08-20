'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 构建系统路由
var SystemEvent = function (_Event) {
    _inherits(SystemEvent, _Event);

    function SystemEvent() {
        _classCallCheck(this, SystemEvent);

        return _possibleConstructorReturn(this, (SystemEvent.__proto__ || Object.getPrototypeOf(SystemEvent)).apply(this, arguments));
    }

    _createClass(SystemEvent, [{
        key: 'eventDidMount',


        // 事件完成挂载
        value: function eventDidMount() {
            this.props.app.all('*', this.cors);
        }

        // 跨域支持

    }, {
        key: 'cors',
        value: function cors(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

            if (req.method == 'OPTIONS') {
                res.send(200); //让options请求快速返回
            } else {
                next();
            }
        }
    }]);

    return SystemEvent;
}(Event);

exports.default = SystemEvent;
//# sourceMappingURL=system.js.map