
// 定义方法基类
class Base {

    // 基类构造方法
    constructor() {
        // 绑定组件所有的方法
        // this.autoBind();
    }

    // 超时执行
    setFinallyTimeout() {
        if (this.finally) {
            this.finallyTO && clearTimeout(this.finallyTO);
            this.finallyTO = setTimeout(this.finally, 1);
        }
    }

    // 绑定方法数组 ==OK==
    bind(methods) {
        // 遍历对象现有方法
        methods.forEach(method => {

            // 重命名旧函数
            this[`_${method}`] = this[method];
            // 重写对象方法
            this[method] = (...param) => {
                // 定义返回值
                let ret;
                // 执行带捕获的方法
                try {

                    // 执行旧方法体
                    ret = this[`_${method}`](...param);
                    // 设置完成超时执行
                    this.setFinallyTimeout();
                } catch ( e ) {
                    // 记录日志信息
                    console.error(e);
                }
                return ret;
            };
        });
    }

    // 执行类的所有方法绑定 ==OK==
    autoBind() {
        this.bind(
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(prop => typeof this[prop] === 'function')
        );
    }

    // 响应输出
    response(res, data) {
        if (res) {
            res.json({
                ok: data ? true : false,
                data: data
            })
        }
    }
}
// 全局基类
global.Base = Base;