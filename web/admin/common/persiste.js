import objectHash from 'object-hash/dist/object_hash.js';
import { message } from 'antd';

// 全局错误信息，显示位置！ 及保留时长
message.config({
    top: 80,
    duration: 5
});

// 全局参数定义
window.nsParam = (function() {

    var envs = {
        pre: { // 预发布
            when: ['stepdev.sh1.newtouch.com'],
            socketUrl: '//stest.newtouch.com',
            loginUrl: '//workdev.sh1.newtouch.com',
            logoutUrl: '//workdev.sh1.newtouch.com',
            userTwodimensionalcodeUrl: '//stepdev.sh1.newtouch.com',
            step: '//stepdev.sh1.newtouch.com',
            console: '//consoledev.sh1.newtouch.com'
        },
        self: { // 本机环境
            when: ['127.0.0.1', 'localhost'],
            // socketUrl: '//192.168.7.254:10098',
            openfireUrl: '//192.168.7.7:7070/http-bind/',
            loginUrl: 'http://127.0.0.1:3000/#/a/login',
            logoutUrl: '//127.0.0.1:3000',
            userTwodimensionalcodeUrl: '//127.0.0.1:81',
            step: '//127.0.0.1:81',
            console: '//127.0.0.1:82'
        },
        dev: { // 开发环境
            when: ['192.168.7.15'],
            // socketUrl: '//192.168.7.254:10098',
            openfireUrl: '//192.168.7.7:7070/http-bind/',
            loginUrl: '//192.168.7.15',
            logoutUrl: '//192.168.7.15',
            userTwodimensionalcodeUrl: '//192.168.7.15:81',
            step: '//192.168.7.15:81',
            console: '//192.168.7.15:82'
        },
        test: { // IDC测试环境
            when: ['newtouchwork.com'],
            // socketUrl: '//step.newtouchwork.com',
            openfireUrl: '//step.newtouchwork.com/http-bind/',
            loginUrl: '//www.newtouchwork.com',
            logoutUrl: '//www.newtouchwork.com',
            userTwodimensionalcodeUrl: '//step.newtouchwork.com',
            step: '//step.newtouchwork.com',
            console: '//hd1.console.newtouchwork.com'
        },
        prod: { // 生产环境
            when: ['newtouch.com'],
            // socketUrl: '//step.newtouch.com',
            openfireUrl: '//step.newtouch.com/http-bind/',
            loginUrl: '//www.newtouch.com',
            logoutUrl: '//www.newtouch.com',
            userTwodimensionalcodeUrl: '//step.newtouch.com',
            step: '//step.newtouch.com',
            console: '//hd1.console.newtouch.com'
        },
        stress: { // 压力测试环境
            when: ['218.245.64.3'],
            socketUrl: 'http://218.245.64.3:45092',
            loginUrl: 'http://218.245.64.3:45079',
            logoutUrl: 'http://218.245.64.3:45079',
            userTwodimensionalcodeUrl: 'http://218.245.64.3:45080',
            step: '//218.245.64.3:45080',
            console: '//220.248.17.34:8063'
        },
        zpprod: { // 周浦生产环境
            when: ['103.36.173.13'],
            // socketUrl: '//218.245.64.3:45092',
            openfireUrl: '//103.36.173.13:20068/http-bind/',
            loginUrl: '//103.36.173.13:20061',
            logoutUrl: '//103.36.173.13:20061',
            userTwodimensionalcodeUrl: '//103.36.173.13:20062',
            step: '//103.36.173.13:20062',
            console: '//103.36.173.13:20080'
        }
    };

    for (var env in envs) {
        for (var w in envs[env].when) {
            if (window.location.href.indexOf(envs[env].when[w]) !== -1) {
                envs[env].env = env;
                return (envs[env]);
            }
        }
    }

    envs['prod'].env = 'prod';
    return envs['prod'];
})();

// ajax 拦截类
class Intercept {
    // 缓存当前ajax 请求url
    ajaxMap = {};

    // 初始化ajax 拦截器
    constructor() {
        // this别名
        let _this = this;
        // 需要检查，阻止的变量
        let loseList = ['LOSE_AJAX_ERROR_MESSAGE', 'LOSE_RESET_FIELDS', 'LOSE_UNLOGIN'];

        // ajax全局配置选项设置
        $.ajaxSetup({
            // ajax请求不缓存
            cache: false,
            // 根据api，该回调能阻止ajax提交
            beforeSend: function(xhr, settings) {
                // 如果已经存在相同的ajax请求
                if (_this.hasAjaxing(settings)) {
                    console.error('重复请求：', settings);
                    // 阻止ajax重复提交
                    return false;
                }
            }
        });

        // ajax发送前回调事件
        $(document).ajaxSend(function(evt, request, settings) {
            // 读取url
            let url = settings.url;
            // 阻止某些操作变量
            for (let i in loseList) {
                let lose = loseList[i];
                if (url.indexOf(lose) > -1) {
                    url = settings.url = _this.cutUrlParam(url, lose);
                    settings[lose] = true;
                }
            }

            // 将ajax请求加入缓存
            _this.addAjaxing(settings);
            // 接收状态对象
            _this.receiveState(settings);
        });

        // ajax请求成功, 拦截后台操作错误的提示消息
        $(document).ajaxSuccess(function(event, xhr, settings) {
            //如果请求状态，不为success的处理
            if ((xhr.responseJSON && 'UNLOGIN' === xhr.responseJSON.code) && !settings['LOSE_UNLOGIN']) {
                // 记录当前url
                var url = window.location.href;
                // 浏览器跳转到登录页面
                window.location.href = `${nsParam.loginUrl}?backurl=${url}`;
            }
            // 清除ajax状态
            _this.clearState(settings, true);
        });

        // ajax请求失败, 提示网络请求错误消息
        $(document).ajaxError(function(event, xhr, settings, exception) {
            // 如果请求状态，不为success时的处理
            if (xhr.responseJSON && xhr.responseJSON.code && xhr.responseJSON.code !== 'SUCCESS') {
                // 请求返回未登录
                if (('UNLOGIN' === xhr.responseJSON.code || '401' == xhr.status) && !settings['LOSE_UNLOGIN']) {
                    // 记录当前url
                    var url = window.location.href;
                    // 浏览器跳转到登录页面
                    window.location.href = `${nsParam.loginUrl}?backurl=${url}`;
                }
            }
            // 清除ajax状态
            _this.clearState(settings);
            // 弹出错误信息
            if (!settings['LOSE_AJAX_ERROR_MESSAGE']) {
                // 弹出全局，错误信息
                xhr.responseJSON && message.error(xhr.responseJSON.message);
            }
        });

        // 扩展jquery ajax支持put delete方法.
        jQuery.each(["put", "delete"], function(i, method) {
            // 构建ajax 请求方法
            jQuery[method] = function(url, data, callback, type) {
                // shift arguments if data argument was omitted
                if (jQuery.isFunction(data)) {
                    type = type || callback || 'json';
                    callback = data;
                    data = undefined;
                }
                // 返回一个ajax请求对象
                return jQuery.ajax({
                    url: url,
                    type: method,
                    dataType: type || 'json',
                    data: data,
                    success: callback || jQuery.noop
                });
            };
        });
    }

    // 接收ajax 加载状态
    receiveState(settings) {
        if (settings) {
            settings.state = [];
            // 保存表单弹窗
            settings.state.push({
                comp: window.ajaxModal,
                loaded: {
                    confirmLoading: true,
                    ok: false
                },
                success: {
                    confirmLoading: false,
                    ok: true
                }
            });
            // 保存ajax按钮、保存ajax遮罩、保存ajax表单
            for (let comp of [window.ajaxButton, window.ajaxTable]) {
                settings.state.push({
                    'comp': comp
                })
            }
            this.changeState(settings);
        }
    }

    changeState(settings, reverse, isOk) {
        for (let i in settings.state) {
            let state = settings.state[i];
            let s = {
                loading: false
            }
            if (reverse) {
                if (state.success) {
                    s = _.extend({}, state.success);
                    if (!isOk || settings['LOSE_RESET_FIELDS']) {
                        _.extend(s, {
                            ok: false
                        });
                    }
                }
            } else {
                s = {
                    loading: true
                };
                if (state.loaded) {
                    s = _.extend({}, state.loaded);
                    if (settings['LOSE_RESET_FIELDS']) {
                        _.extend(s, {
                            ok: false
                        });
                    }
                }
            }
            this.setState(state.comp, s);
        }
    }

    // 清除ajax 加载状态
    clearState(settings, isOk) {
        if (settings) {
            // 移除缓存中的ajax
            this.removeAjaxing(settings);
            // 取消相应 ajax 等待状态, 参看receiveState
            this.changeState(settings, true, isOk);
        }
    }

    // 设置react 组件的状态值
    setState(react, obj) {
        // 组件有效、未卸载、存在setState方法
        if (!_.isUnMount(react) && typeof react.setState === 'function') {
            react.setState(obj);
        }
    }

    // 切除url某个参数
    cutUrlParam(url, key) {
        var regex = new RegExp(`([?&])${key}[^&]*(&)?`);
        return url.replace(regex, function(m, $1, $2) {
            if (!$2) return '';
            return $1
        })
    }

    // 获取当前ajax 请求url (path + param)
    getAjaxUrl(setting) {
        // 如果setting 对象存在，则返回 /v2/user/userInfo + '?' + loginName=chenchaoyang&realName=%E9%99%88%E6%9C%9D%E9%98%B32&userDesc=&sex=48002&addr=&mobile=13601639446&degree=&companyName=&career= 
        var url = setting && setting.url;
        // 去除ajax请求，去缓存 _=随机数
        url = this.cutUrlParam(url, '_');
        // 链接post 请求，参数
        if (setting.data) {
            url += '?' + setting.data;
        }
        // 返回请求url
        return url;
    }

    // 判断是否有相同的请求
    hasAjaxing(setting) {
        // 获取当前ajax 请求url
        var url = this.getAjaxUrl(setting);
        // 是否缓存中存在相同url
        return url && this.ajaxMap[url];
    }

    // 向缓存中添加ajax请求
    addAjaxing(setting) {
        // 获得当前ajax url
        var url = this.getAjaxUrl(setting);
        // ajax url 存在
        if (url) {
            // 将当前ajax url 保存到缓存中，在ajax层面阻止重复提交
            this.ajaxMap[url] = true;
            _.spin.addReq(url.split('?')[0]);
        }
    }

    // 移除缓存中的ajax请求
    removeAjaxing(setting) {
        let _this = this;
        // 获得当前ajax url
        var url = this.getAjaxUrl(setting);
        // ajax url 存在
        if (url) {
            // 定时100毫秒内，置空参数值
            setTimeout(function() {
                _this.ajaxMap[url] = false;
            }, 100);
            _.spin.removeReq(url.split('?')[0]);
        }
    }
}
// 实例化ajax 拦截对象
let ajaxIntercept = new Intercept();

// 请求处理类
class Request {

    host = 'http://127.0.0.1:18080';

    // 后端请求类，构造方法
    constructor(coll, method, url, name, cache, next, param) {
        // 请求绑定集合
        this.coll = coll;
        // ajax 请求方法
        this.method = method;
        // 获取ajax 请求url
        this.url = url;
        // 请求名称
        this.name = name;
        // 是否缓存该次请求结果
        this.cache = cache;
        // 完成本次请求,继续执行next指定请求
        this.next = next;
        // ajax时的传递参数
        this.param = param;
    }

    // 使用查询字段
    fields(fields) {
        this._fields = fields;
        return this;
    }

    // 使用表格分页器
    pagination(pagination) {
        if (pagination) {
            this._pageSize = pagination.pageSize;
            this._pageNo = pagination.current;
        }
        return this;
    }

    // 设置每页条数
    pageSize(pageSize) {
        this._pageSize = pageSize;
        return this;
    }

    // 设置查询页码
    pageNo(pageNo) {
        this._pageNo = pageNo;
        return this;
    }

    // 接收排序数据
    sort(sort) {
        // 设置排序条件
        this._sort = sort;
        // 支持访问链
        return this;
    }

    // ajax 操作后绑定的组件
    widget(react) {
        // 当前组件
        this.react = react;
        // 支持访问链
        return this;
    }

    // 回调操作
    callback(func) {
        // 设置回调函数
        this._callback = func;
        // 支持访问链
        return this;
    }

    // loading effect
    spin(ref) {
        window.ajaxSpin = ref && ref.id;
        return this;
    }

    // 设置组件状态值
    setState(data) {
        // 如果存在请求组件
        if (this.react) {
            // 初始化状态值
            let r = {};
            // 遍历状态值
            for (let k in this.state) {
                // 获取设置值
                let val = this.state[k];
                // 如果是字符串，则设置ajax结果值
                if (_.isString(val)) {
                    let v = _.get(data, val);
                    if (_.isUndefined(v) || v == null) {
                        v = val;
                    }
                    r[k] = v;
                // 如果是函数类型，则调用函数
                } else if (_.isFunction(val)) {
                    r[k] = val();
                // 如果是其他，则直接赋值
                } else {
                    r[k] = val;
                }
            }
            // 如果组件未卸载，设置组件ajax 后状态
            !_.isUnMount(this.react) && this.react.setState(r);
        }
    }

    // 执行ajax操作，并回调函数
    ajax(state) {
        // 设置请求状态
        this.state = state;
        // 执行ajax请求
        return this.excute();
    }

    // 获取缓存结果
    cache(state) {
        // 请求对象别名
        let _this = this;
        // 设置当前状态值
        this.state = state;
        // 获取集合对请求，数据缓存值
        return this.coll.getData(this).done((data) => {
            // 设置组件状态值
            _this.setState(data);
        });
    }

    // 先查询缓存，没有缓存，请求ajax
    cacheOrAjax(state) {
        let _this = this;
        let dfd = $.Deferred();
        this.cache(state).done((data) => {
            dfd.resolve(data);
        }).fail((err) => {
            // 设置请求状态
            _this.state = state;
            // 执行ajax请求
            _this.excute().done((d) => {
                dfd.resolve(d);
            }).fail((e) => {
                dfd.reject(e);
            });
        });
        return dfd.promise();
    }

    // 执行方法
    excute() {
        // 当前对象别名
        let _this = this;
        // 执行相应方法请求
        return this[this.method]().done((data) => {
            // 如果存在access_token,则覆盖现有access_token
            data.access_token && _.setItem('access_token', data.access_token);
            // 如果为get 请求
            if (_this.method === 'get') {
                // 修改相应字段值
                data = _this.coll.proxyFields(data);
            }
            // 对函数进行回调
            _.isFunction(_this._callback) && _this._callback(data);
            // 设置组件状态值
            _this.setState(data);
            // 记录该次请求
            _this.coll.recordRequest(_this);
            // 设置组件请求数据
            _this.cache && _this.coll.setData(_this, data);
            // 执行下次请求
            _.isString(_this.next) && _this.coll.nextRequest(_this.next);
        });
    }

    // 获取请求url
    getUrl() {
        let url = this.url(this.param);
        url = !_.startsWith(url, '/') ? '/' + url : url;
        url = this.host + url;
        return `${url}${_.urlSpace(url)}access_token=${_.getItem('access_token') || _.uuid()}`;
    }

    // 发起ajax get请求
    get() {
        return $.get(this.getUrl(), {
            query: this.param,
            fields: this._fields,
            sort: this._sort,
            pageNo: this._pageNo,
            pageSize: this._pageSize
        });
    }

    json() {
        return $.ajax({
            type: "POST",
            url: this.getUrl(),
            data: JSON.stringify(this.param),
            dataType: "json",
            contentType: "application/json"
        });
    }

    putJson() {
        return $.ajax({
            type: "PUT",
            url: this.getUrl(),
            data: JSON.stringify(this.param),
            dataType: "json",
            contentType: "application/json"
        });
    }

    // 发起ajax post请求
    post() {
        return $.post(this.getUrl(), this.param);
    }

    // 发起ajax put请求
    put() {
        return $.put(this.getUrl(), this.param);
    }

    // 发起ajax delete请求
    delete() {
        return $.delete(this.getUrl(), this.param);
    }
}

// 集合处理类
class Collection {

    // 集合构造方法 ==OK==
    constructor(name, items) {
        // 集合名称
        this.name = name;
        let path = this.mongo = `/p/${name}`;

        // 集合请求url
        this.colUrl = (param) => {
            return path;
        };
        // 文档请求url
        this.docUrl = (param) => {
            return path + '/' + (_.isString(param) ? param : param._id);
        };
    }

    // 字段规则
    setFieldRule = null;

    // 设置字段规则
    setFields(param) {
        this.setFieldRule = param;
    }

    // 重命名规则
    renameFieldRule = null;

    renameFields(param) {
        this.renameFieldRule = param;
    }

    // 返回被代理的结果
    proxyFields(data) {
        // 如果存在字段规则
        if (this.setFieldRule) {
            // 遍历字段规则
            for (let j in this.setFieldRule) {
                // 过得字段规则
                let fr = this.setFieldRule[j];
                // 获取数据路径
                let p = fr.path;
                // 获取该数据规则
                let rule = fr.rule;
                // 根据路径，查询数据
                let obj = _.get(data, p);
                // 如果数据为数组类型
                if (_.isArray(obj)) {
                    // 遍历数组
                    for (let i in obj) {
                        // 获取单个值
                        let a = obj[i];
                        // 遍历所有字段规则
                        for (let k in rule) {
                            // 取得相应规则函数
                            let func = rule[k];
                            // 修改字段值
                            a[k] = func(_.isUndefined(a[k]) ? a : a[k]);
                        }
                    }
                // 如果数据为对象类型
                } else if (_.isObject(obj)) {
                    // 遍历所有字段规则
                    for (let k in rule) {
                        // 取得相应规则函数
                        let func = rule[k];
                        // 修改字段值
                        obj[k] = func(_.isUndefined(obj[k]) ? obj : obj[k]);
                    }
                } else if (obj && 'entity' !== p) {
                    // 遍历所有字段规则
                    for (let k in rule) {
                        // 取得相应规则函数
                        let func = rule[k];
                        // 修改字段值
                        _.set(data, p, func(obj));
                    }
                }
            }
        }
        // 如果存在重命名规则
        if (this.renameFieldRule) {
            // 遍历字段规则
            for (let j in this.renameFieldRule) {
                // 过得字段规则
                let fr = this.renameFieldRule[j];
                // 获取数据路径
                let p = fr.path;
                // 获取该数据规则
                let rule = fr.rule;
                // 根据路径，查询数据
                let obj = _.get(data, p);
                // 如果数据为数组类型
                if (_.isObject(obj)) {
                    this.renameFunc(obj, rule);
                }
            }
        }
        // 返回ajax数据
        return data;
    }

    // 重命名方法
    renameFunc(obj, rule) {
        if (_.isArray(obj)) {
            for (let i in obj) {
                this.renameFunc(obj[i], rule);
            }
        }
        for (let k in obj) {
            let v = obj[k];
            if (_.isObject(v)) {
                this.renameFunc(v, rule);
            }
            let nk = rule[k];
            if (nk) {
                obj[nk] = v;
                delete obj[k];
            }
        }
    }

    // 设置集合方法
    api(options) {
        let fn = options.name;
        this[fn] = (function(param) {
            return new Request(this.coll, this.method, this.url, this.name, this.cache, this.next, param);
        }).bind({
            coll: this,
            url: options.url,
            method: options.method || 'get',
            name: fn,
            cache: options.cache,
            next: options.next
        });
    }

    // 缓存get请求
    cacheGet = {};

    // 记录该次请求
    recordRequest(request) {
        this.cacheGet[request.name] = request;
    }

    // 执行下次请求
    nextRequest(reqName) {
        // 获取将要执行的请求
        let req = this.cacheGet[reqName];
        // 执行请求
        req && req.excute();
    }

    // 集合对数据的缓存
    cacheData = {};

    // 缓存当前请求数据
    setData(request, data) {
        this.cacheData[request.name] = data;
    }

    // 获取集合请求缓存数据
    getData(request) {
        // 获取该请求，缓存数据
        let data = this.cacheData[request.name];
        // 承诺对象形式，返回数据
        return data ? _.resolve(data) : _.reject(data);
    }

    // 方法调用map
    callMap = {};
    // 组件卸载后，需执行的回调
    callback = {};

    // 定义一个回调
    define(key, widget, func) {
        // 如果存在当前key 的回调
        if (this.callback[key]) {
            // 执行回调方法
            func(...this.callback[key]);
        }
        // 保存对调方法
        this.callMap[key] = {
            w: widget,
            f: func
        };
    }

    // 执行一个回调
    call(key, ...value) {
        // 获取集合内，该key 的执行对象
        let co = this.callMap[key];
        // 如果对象存在
        if (co) {
            // 如果组件已经，被卸载
            if (_.isUnMount(co.w)) {
                // 记录需回调的对象
                this.callback[key] = value;
            // 如果组件存在
            } else {
                // 执行定义的方法
                co.f(...value);
            }
        // 对象不存在
        } else {
            // 记录需回调的对象
            this.callback[key] = value;
        }
    }

    // 查询某集合，表格列表
    tableList(pagination, filters, sorter) {
        // 构建请求对象
        return this.list(_.$in(filters)).pagination(pagination).sort(_.$sort(sorter));
    }

    // 获取用户标识 ==OK==
    getUserId() {
        return 'visitor';
    }

    // 获取主键标识 ==OK==
    getId() {
        return `${_.now()}.${this.getUserId()}.${this.name}`
    }

    // 设置mongo请求
    mongoReqs(options) {
        let _this = this;
        // 设置项
        if (!options) {
            options = {};
        }
        // 查询集合请求
        this.api({
            name: 'list',
            url: this.colUrl,
            cache: options.list && options.list.cache
        });
        // 查询文档详情请求
        this.api({
            name: 'detail',
            url: this.docUrl,
            cache: options.detail && options.detail.cache
        });
        // 设置添加后，要进行的请求
        let addNext = options.add && options.add.next;
        // 向集合添加数据
        this.api({
            name: 'add',
            method: 'post',
            url: (param) => {
                // 如果数据，不存在_id
                if (!param._id) {
                    // 设置数据 _id
                    param._id = _this.getId();
                }
                return _this.colUrl(param);
            },
            next: _.isUndefined(addNext) ? 'list' : addNext
        });
        // 更新请求，后一次请求
        let updateNext = options.update && options.update.next;
        // 修改文档请求
        this.api({
            name: 'update',
            method: 'put',
            url: this.docUrl,
            next: _.isUndefined(updateNext) ? 'list' : updateNext
        });
        // 删除请求,后一次请求
        let deleteNext = options.delete && options.delete.next;
        // 删除文档请求
        this.api({
            name: 'delete',
            method: 'delete',
            url: this.docUrl,
            next: _.isUndefined(deleteNext) ? 'list' : deleteNext
        });
    }
}

// 定义集合操作类
window.db = {
    build: (key) => {
        return new Collection(key);
    }
};
