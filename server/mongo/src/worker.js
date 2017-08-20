'use strict';

// 导入co 组件
const co = require('co');

const parser = require('nools/lib/parser');
const constraintMatcher = require('nools/lib/constraintMatcher');

/**
 * [workerFunc 工作流对象]
 * @return {[type]} [description]
 */
let workerFunc = function() {

    // 返回对象
    let exp = {};

    // 操作对象
    exp.opers = {};
    // 操作流对象
    exp.flows = {};
    // 解析表达式
    exp.parses = {};

    console.info('coming in work');

    exp.parse = function(obj) {
        if (_.isObject(obj)) {
            for (let k in obj) {
                let v = obj[k];
                obj[k] = exp.parse(v);
            }
        } else if (_.isString(obj)) {
            try {
                return JSON.parse(obj);
            } catch ( e ) {}
        }
        return obj;
    }

    exp.loopContext = function(context, attrs, obj) {
        if (!_.isObject(context) || !_.isString(attrs)) {
            return;
        }
        let os = attrs.split('.');
        let r = context;
        for (let i = 0; i < os.length - 1; i++) {
            let n = os[i];
            if (!r[n]) {
                r[n] = {}
            }
            r = r[n];
        }
        r[os[os.length - 1]] = obj;
    }

    exp.loopAttr = function(attrs, type) {
        if (!_.isString(attrs)) {
            return;
        }
        let os = attrs.split('.');
        let r = exp[type];
        let define = false;
        for (let i in os) {
            let n = os[i];
            if (!r[n]) {
                r[n] = {};
                define = true;
            }
            r = r[n];
        }
        if (!define) {
            throw new Error("worker." + type + '.' + attrs + ' obj exists!!');
        }
        return r;
    }

    exp.oper = function(operName, condition, func, isPromise) {
        if (!_.isString(operName) || !_.isString(condition) || !_.isFunction(func)) {
            return;
        }
        let o = exp.loopAttr(operName, 'opers');
        o['name'] = operName;
        o['cond'] = condition;
        if (isPromise) {
            o['func'] = (param, context) => {
                return new Promise((resolve, reject) => {
                    func.bind({
                        resolve: resolve,
                        reject: reject
                    })(param, context);
                }).then((data) => {
                    exp.loopContext(context, operName, data);
                }).catch((err) => {
                    let code = 'error.' + o.name;
                    exp.loopContext(context, code, {
                        'code': code,
                        'msg': err.toString()
                    });
                });
            }
        } else {
            o['func'] = (param, context) => {
                let r = func(param, context);
                exp.loopContext(context, operName, r);
            }
        }
        o['isPromise'] = isPromise;
        o['type'] = 'oper';
    }

    exp.recursionOper = function(operArray, os) {
        for (var i in operArray) {
            var o = operArray[i];
            if ('flow' === o.type) {
                exp.recursionOper(o.operArray, os);
            } else {
                os.push(o);
            }
        }
    }

    exp.getOperArr = function(operArray) {
        var os = [];
        exp.recursionOper(operArray, os);
        return os;
    }

    exp.flow = function(flowName, operArray, operResult) {
        if (!_.isString(flowName) || !_.isArray(operArray)) {
            return;
        }
        let f = exp.loopAttr(flowName, 'flows');
        f['name'] = flowName;
        f['type'] = 'flow';
        f['operArray'] = exp.getOperArr(operArray);
        f['do'] = exp.do.bind(f);
        f['result'] = operResult;
    }

    exp.valid = function(condStr, condVal) {
        if (!_.isString(condStr) || !_.isObject(condVal)) {
            return;
        }
        let matcher = exp.parses[condStr];
        if (!matcher) {
            let po = parser.parseConstraint(condStr);
            matcher = constraintMatcher.getMatcher(po);
            exp.parses[condStr] = matcher;
        }
        return matcher(condVal);
    }

    exp.result = function(context, oper) {
        if (!_.isObject(context) || !_.isObject(oper)) {
            return;
        }
        var attrs = oper.name;
        let os = attrs.split('.');
        let r = context;
        for (let i in os) {
            let n = os[i];
            r = r[n];
        }
        return r;
    }

    exp.do = function(param, res) {

        if (!param) {
            param = {};
        }

        let context = {};
        let operArray = this.operArray;

        let _this = this;

        // 异步执行行动处理
        return co(function*() {
            for (let i in operArray) {
                let oper = operArray[i];

                if (_.isArray(oper)) {

                    let cond = oper[0];
                    if (!exp.valid(cond, {
                            p: param,
                            c: context,
                            'config': config
                        })) {
                        continue;
                    }
                    oper = oper[1];
                }

                if (oper.type === 'oper') {
                    if (exp.valid(oper.cond, {
                            p: param,
                            c: context,
                            'config': config
                        })) {
                        if (oper.isPromise) {
                            yield oper.func(param, context);
                        } else {
                            oper.func(param, context);
                        }
                    } else {
                        let code = 'error.' + oper.name;
                        exp.loopContext(context, code, {
                            'code': code,
                            'msg': oper.cond + ' param is error'
                        });
                    }
                }
            }
            // 返回参数值
            return context;
        }).then((data) => {
            if (res) {

                let code = true;
                let r;
                if (context.error) {
                    code = false;
                    r = context.error;
                } else {
                    let oa = _this.operArray;
                    let or = _this.result;
                    if (!or) {
                        or = oa && oa[oa.length - 1];
                    }
                    r = exp.result(data, or);
                }

                if (_.isFunction(res.json)) {
                    res.json({
                        ok: code,
                        data: r
                    });
                } else {
                    res = r;
                }
            }
            return data;
        }).catch((err) => {
            if (res) {
                if (_.isFunction(res.json)) {
                    res.json({
                        ok: false,
                        data: context.error
                    });
                } else {
                    res = context.error;
                }
            }
            return err;
        });
    }

    // 返回对象
    return exp;
}

// 工作流对象放入全局
global.worker = workerFunc();
// 输出工作流对象
module.exports = worker;
