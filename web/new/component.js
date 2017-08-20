// 导入react 组件
import React, { Component } from 'react';
// 使用页面刷新时，数据比较
import shallowEqual from 'fbjs/lib/shallowEqual';
// 生成对象hash 字符串
import hash from 'object-hash/dist/object_hash.js';
// 事件发布订阅
import PubSub from 'pubsub-js';

// 高级定制组件类 【作者：陈朝阳】
class DsComponent extends Component {

    // 每个组件都有唯一标识，一般用于组件id <div id={this.id}>...</div>
    id = _.uuid();

    // 组件构造方法
    constructor(props) {
        // 调用 'React.Component' 构造方法
        super(props);
        // 扩展组件状态属性
        this.extendState();
        // 覆盖组件生命周期方法，添加全局控制逻辑
        this.overrideLifecycle();
        // 将所有方法，绑定this
        this.autoBind();
    }

    // 扩展主键状态属性
    extendState() {
        // 设置初始化 state 值
        this.state = Object.assign({
            hash: 'init', // 定义初始hash 值
            visible: true, // 定义组件在可视区域，只处理可视区组件；提升性能 
        }, this.state);
    }

    // 覆盖组件生命周期方法
    overrideLifecycle() {

        // 定义一个空函数
        let empty = () => {
        };

        // 页面挂载，触发的生命周期方法
        // Mounting: Class constructor -> componentWillMount -> render -> componentDidMount

        // 组件将要被加载到页面
        this._componentWillMount = this.componentWillMount || empty;
        this.componentWillMount = this.overrideComponentWillMount;
        // 组件已经加载到页面
        this._componentDidMount = this.componentDidMount || empty;
        this.componentDidMount = this.overrideComponentDidMount;

        // 页面卸载，触发的生命周期方法
        // Unmounting: componentWillUnmount

        // 组件将要从页面移除
        this._componentWillUnmount = this.componentWillUnmount || empty;
        this.componentWillUnmount = this.overrideComponentWillUnmount;

        // 组件属性更新，触发生命周期方法
        // Props Changes: componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
        // 组件状态更新，触发生命周期方法
        // State Changes: shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate

        // 组件改变状态方法
        this._setState = this.setState;
        this.setState = this.overrideSetState;
        // 组件将要接收新属性
        this._componentWillReceiveProps = this.componentWillReceiveProps || empty;
        this.componentWillReceiveProps = this.overrideComponentWillReceiveProps;
        // 组件将要更新，通过该方法，返回true：允许组件更新；返回false：拒绝组件更新
        this._shouldComponentUpdate = this.shouldComponentUpdate;
        this.shouldComponentUpdate = this.overrideShouldComponentUpdate;
        // 组件更新前回调函数
        this._componentWillUpdate = this.componentWillUpdate || empty;
        this.componentWillUpdate = this.overrideComponentWillUpdate;
        // 组件更新完成
        this._componentDidUpdate = this.componentDidUpdate || empty;
        this.componentDidUpdate = this.overrideComponentDidUpdate;
    }

    // 组件将要被加载到页面
    overrideComponentWillMount() {
        if (!this.name) {
            throw new Error('组件必须name属性')
        }
        // 全局缓存组件
        _.setComponent(this.name, this);
        // 执行子类回调
        this._componentWillMount();
    }

    // 组件已经加载到页面
    overrideComponentDidMount() {
        // 可以添加的逻辑： 1. 判断组件是否在可视区域, 如果不在，只渲染<div></div>, 停止ajax请求来 提升性能

        // 执行子类回调
        this._componentDidMount();
    }

    // 组件将要从页面移除
    overrideComponentWillUnmount() {
        // 当前组件已被卸载
        this.isUnMount = true;
        // 移除全局组件缓存
        _.removeComponent(this.name);
        // 清除相关订阅
        this.clearPubSub();
        // 执行子类回调
        this._componentWillUnmount();
    }

    // 组件改变状态方法, 如果param数组编号, hash将被改变
    overrideSetState(nextState) {
        try {
            // 为扩展属性后的对象，生成hash值
            let no = Object.assign({}, this.state, nextState);
            // 删除原有的hash
            delete no.hash;
            // 计算新的hash 值
            nextState.hash = hash(no);
        } catch ( e ) {}
        // 如果组件已卸载，退出设置状态
        if (_.isUnMount(this)) {
            return;
        }
        // 设置组件状态
        this._setState(nextState);
    }

    // 组件将要接收新属性
    overrideComponentWillReceiveProps(nextProps) {
        // 添加全局，控制逻辑
        // 执行子类回调
        this._componentWillReceiveProps(nextProps);
    }

    // 组件将要更新，通过该方法，返回true：允许组件更新；返回false：拒绝组件更新
    overrideShouldComponentUpdate(nextProps, nextState) {
        // 存在子类覆盖方法，则执行子类逻辑
        if (this._shouldComponentUpdate) {
            return this._shouldComponentUpdate(nextProps, nextState);
        }
        // 默认属性比对，状态比对
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    // 组件更新前回调函数
    overrideComponentWillUpdate(nextProps, nextState) {
        // 添加全局，控制逻辑
        // 执行子类回调
        this._componentWillUpdate();
    }

    // 组件更新完成
    overrideComponentDidUpdate(prevProps, prevState) {
        // 发出属性改变事件
        if (!shallowEqual(this.props, prevProps)) {
            this.publishProps(this.props);
        }
        // 发出状态改变事件
        if (!shallowEqual(this.state, prevState)) {
            this.publishState(this.state);
        }
        // 执行子类回调
        this._componentDidUpdate();
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

    // 获取某个组件
    get(name) {
        return _.getComponent(name);
    }

    // 订阅其他组件
    subscribeArr = [];

    // 清除相关订阅
    clearPubSub() {
        // 清除组件自身订阅
        PubSub.unsubscribe(this.name);
        // 销毁对其他组件的订阅
        for (let i in this.subscribeArr) {
            PubSub.unsubscribe(this.subscribeArr[i]);
        }
    }

    // 发布属性变更 触发 subscribe、subscribeProps
    publishProps(props) {
        PubSub.publish(`${this.name}.props`, props);
    }

    // 发布属性变更，触发 subscribe、subscribeState
    publishState(state) {
        PubSub.publish(`${this.name}.state`, state);
    }

    // 组件事件订阅，公共方法
    _subscribe(key, callback) {
        // 如果回调函数存在
        if (_.isFunction(callback)) {
            // 发起组件订阅
            let sub = PubSub.subscribe(key, callback);
            // 记录订阅对象，用于销毁处理
            this.subscribeArr.push(sub);
        }
    }

    // 订阅某组件，属性、状态变更
    subscribe(name, callback) {
        this._subscribe(name, callback);
    }

    // 订阅某组件，属性变更
    subscribeProps(name, callback) {
        this._subscribe(`${name}.props`, callback);
    }

    // 订阅某组件，状态变更
    subscribeState(name, callback) {
        this._subscribe(`${name}.state`, callback);
    }
}
// 定义为全局组件
window.DsComponent;