'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 定义方法基类
var Base = function () {

    // 基类构造方法
    function Base() {
        _classCallCheck(this, Base);
    }
    // 绑定组件所有的方法
    // this.autoBind();


    // 超时执行


    _createClass(Base, [{
        key: 'setFinallyTimeout',
        value: function setFinallyTimeout() {
            if (this.finally) {
                this.finallyTO && clearTimeout(this.finallyTO);
                this.finallyTO = setTimeout(this.finally, 1);
            }
        }

        // 绑定方法数组 ==OK==

    }, {
        key: 'bind',
        value: function bind(methods) {
            var _this = this;

            // 遍历对象现有方法
            methods.forEach(function (method) {

                // 重命名旧函数
                _this['_' + method] = _this[method];
                // 重写对象方法
                _this[method] = function () {
                    // 定义返回值
                    var ret = void 0;
                    // 执行带捕获的方法
                    try {

                        // 执行旧方法体
                        ret = _this['_' + method].apply(_this, arguments);
                        // 设置完成超时执行
                        _this.setFinallyTimeout();
                    } catch (e) {
                        // 记录日志信息
                        console.error(e);
                    }
                    return ret;
                };
            });
        }

        // 执行类的所有方法绑定 ==OK==

    }, {
        key: 'autoBind',
        value: function autoBind() {
            var _this2 = this;

            this.bind(Object.getOwnPropertyNames(this.constructor.prototype).filter(function (prop) {
                return typeof _this2[prop] === 'function';
            }));
        }

        // 响应输出

    }, {
        key: 'response',
        value: function response(res, data) {
            if (res) {
                res.json({
                    ok: data ? true : false,
                    data: data
                });
            }
        }
    }]);

    return Base;
}();
// 全局基类


global.Base = Base;
//# sourceMappingURL=base.js.map