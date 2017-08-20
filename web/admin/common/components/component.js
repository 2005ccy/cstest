// 导入react 组件
import React from 'react';
// 导入浏览器历史组件，用于页面跳转
import { hashHistory } from 'react-router'
// 使用页面刷新时，数据比较
import shallowEqual from 'fbjs/lib/shallowEqual';
// 生成对象hash 字符串
import hash from 'object-hash/dist/object_hash.js';

class Component extends React.Component {

    // 每个组件都有唯一标识 ==OK==
    id = _.uuid();

    // 组件构造方法 ==OK==
    constructor(props, shouldAutoBind = true) {

        // 调用 'React.Component' 构造方法
        super(props);

        // 设置初始化 state 值
        this.state = Object.assign({
            hash: 'init', // 定义初始hash 值
            langStamp: _.i18n.timestamp // 定义组件语言
        }, this._getInitialState(), this.state);

        // 绑定组件所有的方法
        if (shouldAutoBind) {
            this.autoBind();
        }

        // 别名 setState 方法
        this._setState = this.setState;
        // 代理setState 方法，会进入方法
        this.setState = (param) => {

            try {
                // 设置默认值
                for (let k in param) {
                    // 获取状态当前值
                    let nv = param[k];
                    // 如果当前值无效
                    if (!nv) {
                        // 获取状态原有值
                        let ov = this.state[k];
                        // 如果原有值为数组
                        if (_.isArray(ov)) {
                            // 设置空数组
                            param[k] = [];
                        // 如果原有值为对象
                        } else if (_.isObject(ov)) {
                            // 设置空对象
                            param[k] = {};
                        // 如果原有值为字符串
                        } else if (_.isString(ov)) {
                            // 设置空字符串
                            param[k] = '';
                        }
                    }
                }
                // 为扩展属性后的对象，生成hash值
                let no = Object.assign({}, this.state, param);
                // 删除原有的hash
                delete no.hash;
                // 计算新的hash 值
                param.hash = hash(no);
            } catch ( e ) {}
            // 如果组件已卸载，退出设置状态
            if (_.isUnMount(this)) {
                return;
            }
            // 设置组件状态
            this._setState(param);
        }

        // 注册当前组件
        _.curWidgets[this.id] = this;
    }

    // 绑定方法数组 ==OK==
    bind(methods) {
        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    // 执行类的所有方法绑定 ==OK==
    autoBind() {
        this.bind(
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(prop => typeof this[prop] === 'function')
        );
    }

    hash(obj) {
        return hash(obj);
    }

    // 实现 'getInitialState' 兼容性 ==OK==
    _getInitialState() {
        return {};
    }

    // 当属性或状态修改，则render 重新渲染组件 ==OK==
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.langStamp != _.i18n.langStamp && nextState.langStamp != _.i18n.langStamp) {
            this.state.langStamp = _.i18n.langStamp;
            return true;
        }
        if (nextProps.route && !_.includes(location.href, '#')) {
            // 头部的滑出菜单隐藏
            $('.index_pane_subtitle').hide();
            // 滚动条回到顶部
            window.scrollTo(0, 0);
            // 头部显示
            $('.navbar').removeClass('hide');
        }
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    componentWillUnmount() {
        // 当前组件已被卸载
        this.isUnMount = true;
        // 删除当前组件
        delete _.curWidgets[this.id];
    }

    // 使浏览器，跳转到指定目录 ==OK==
    go(path) {
        hashHistory.push(path);
    }

    // 刷新路由
    refresh() {
        // 获取当前url
        let href = location.href;
        // 刷新当前路由
        hashHistory.replace(href.substring(href.indexOf('/', 10)));
    }

    // 设置表单初始值, form 表单数据、单条数据 ==OK==
    formInitValue(form, item) {
        // 如果参数无效，返回当前form
        if (_.isEmpty(form) || _.isEmpty(item)) {
            return form;
        }
        // 新表单数据
        let r = {};
        // 新的字段集合
        let fs = [];
        // 遍历当前表单字段
        for (let f of form.fields) {
            // 获取字段名称
            let n = f.name;
            // 如果名称存在
            if (n) {
                // 提取当前数据值
                let v = item[n];
                // 设置表单控件，初始值
                fs.push(_.extend(f, v));
            // 如果没有字段名称，则与原字段相同
            } else {
                fs.push(f);
            }
        }
        // 赋值字段数组
        r.fields = fs;
        // 赋值表单属性
        r.formProps = form.formProps;
        // 赋值submit 回调
        r.submit = form.submit;
        // 返回新的表单数据
        return r;
    }

    // 组件jquery查询
    jquery(sel) {
        return $(`#${this.id} ${sel}`);
    }
}
// 设置全局组件
window.Component = Component;