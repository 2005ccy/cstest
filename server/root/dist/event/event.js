'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventOperator = require('./event-operator.js');

var _eventOperator2 = _interopRequireDefault(_eventOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // 导入事件处理器


// 事件相关类
var Event = function (_EventOperator) {
    _inherits(Event, _EventOperator);

    // 事件构造方法
    function Event(props) {
        _classCallCheck(this, Event);

        // 设置事件属性
        var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this, props));
        // 父类构造方法


        _this.props = props;

        // 将所有方法，绑定this
        _this.autoBind();
        return _this;
    }

    // 绑定方法数组


    _createClass(Event, [{
        key: 'bind',
        value: function bind(methods) {
            var _this2 = this;

            methods.forEach(function (method) {
                _this2[method] = _this2[method].bind(_this2);
            });
        }

        // 执行类的所有方法绑定

    }, {
        key: 'autoBind',
        value: function autoBind() {
            var _this3 = this;

            this.bind(Object.getOwnPropertyNames(this.constructor.prototype).filter(function (prop) {
                return typeof _this3[prop] === 'function';
            }));
        }

        // 事件将要挂载

    }, {
        key: 'eventWillMount',
        value: function eventWillMount() {}

        // 事件挂载成功

    }, {
        key: 'eventDidMount',
        value: function eventDidMount() {}
    }]);

    return Event;
}(_eventOperator2.default);
// 定义为全局变量


global.Event = Event;

/*
情境 S:

事件处理模型，将所有操作抽象成事件处理
任务 T:

事件处理器 Event Processor 负责，事件Event 生命周期的触发、事件串行，并行处理
事件Event 实现生命周期逻辑，构建其余事件逻辑关系
行动 A:

事件挂载 Mounting
// class constructor -> eventWillMount -> eventDidMount
eventDidMount() {   
  // 触发其他事件
  this.event(AjaxEvent, this).props({key: 'value'}).setState({}).then(()=> {
    
  });
}
事件状态更新 State Change
// 触发事件状态更新
this.setState({
   key: value
});
// eventWillUpdate -> checkEventFinish
事件卸载 UnMounting
// checkEventFinish -> eventFinish -> eventWillUnmount
*/
//# sourceMappingURL=event.js.map