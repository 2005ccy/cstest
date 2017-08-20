import EventOperator from './event-operator.js';

// 事件处理器
export default class EventProcessor {

    // 事件处理器构造方法
    constructor() {}

    // 设置事件
    event(event) {
        // 构建事件操作器
        return new EventOperator(event);
    }

}