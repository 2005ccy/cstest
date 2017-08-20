'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventOperator = require('./event-operator.js');

var _eventOperator2 = _interopRequireDefault(_eventOperator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 事件处理器
var EventProcessor = function () {

    // 事件处理器构造方法
    function EventProcessor() {
        _classCallCheck(this, EventProcessor);
    }

    // 设置事件


    _createClass(EventProcessor, [{
        key: 'event',
        value: function event(_event) {
            // 构建事件操作器
            return new _eventOperator2.default(_event);
        }
    }]);

    return EventProcessor;
}();

exports.default = EventProcessor;
//# sourceMappingURL=event-processor.js.map