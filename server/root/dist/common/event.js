"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 事件相关类
var Event = function () {

  // 事件构造方法
  function Event(props) {
    _classCallCheck(this, Event);
  }

  // 事件将要挂载


  _createClass(Event, [{
    key: "eventWillMount",
    value: function eventWillMount() {}

    // 事件挂载成功

  }, {
    key: "eventDidMount",
    value: function eventDidMount() {}
  }]);

  return Event;
}();

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