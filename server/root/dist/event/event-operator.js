"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 事件操作相关类
var EventOperator = function () {

    // 事件操作构造方法
    function EventOperator(event) {
        _classCallCheck(this, EventOperator);

        this._event = event;
    }

    // 设置事件属性


    _createClass(EventOperator, [{
        key: "props",
        value: function props(_props) {
            this._props = _props;
            return this;
        }

        // 执行相关事件

    }, {
        key: "do",
        value: function _do() {
            // 构建事件对象
            this.eventObj = new this._event(this._props);
            // 事件对象将要挂载
            this.eventObj.eventWillMount();
            // 事件对象挂载成功
            this.eventObj.eventDidMount();
        }

        // 改变自身状态

    }, {
        key: "setState",
        value: function setState(state) {}
    }]);

    return EventOperator;
}();

exports.default = EventOperator;
//# sourceMappingURL=event-operator.js.map