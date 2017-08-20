// 导入事件处理器
import EventOperator from './event-operator.js';

// 事件相关类
class Event extends EventOperator {

    // 事件构造方法
    constructor(props) {
        // 父类构造方法
        super(props);
        // 设置事件属性
        this.props = props;

        // 将所有方法，绑定this
        this.autoBind();
    }

    // 绑定方法数组
    bind(methods) {
        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    // 执行类的所有方法绑定
    autoBind() {
        this.bind(
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(prop => typeof this[prop] === 'function')
        );
    }

    // 事件将要挂载
    eventWillMount() {}

    // 事件挂载成功
    eventDidMount() {}


}
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