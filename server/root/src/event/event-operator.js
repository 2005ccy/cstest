// 事件操作相关类
export default class EventOperator {

    // 事件操作构造方法
    constructor(event) {
        this._event = event;
    }

    // 设置事件属性
    props(props) {
        this._props = props;
        return this;
    }

    // 执行相关事件
    do() {
        // 构建事件对象
        this.eventObj = new this._event(this._props);
        // 事件对象将要挂载
        this.eventObj.eventWillMount();
        // 事件对象挂载成功
        this.eventObj.eventDidMount();
    }

    // 改变自身状态
    setState(state) {}

}
