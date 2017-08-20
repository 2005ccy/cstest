
// 扩展 _ 方法
Object.assign(_, {
    // 当前组件
    curWidgets: {},
    // 设置现有组件国际化
    setCurWidgetsLang: (langStamp) => {
        for (let id in _.curWidgets) {
            let w = _.curWidgets[id];
            if (_.isUnMount(w)) {
                delete _.curWidgets[id];
                continue;
            }
            // 设置国际化状态
            w.setState({
                langStamp: langStamp
            });
        }
    },
    // jquery 选择器
    selector: (s) => {
        if (!s.context || s.length < 1) {
            let a = ['', '#', '.'];
            for (let i in a) {
                let t = `${a[i]}${s}`;
                if ($(t).length > 0) {
                    return t;
                }
            }
        }
        return s;
    },
    // 检查dom效果
    checkDom: (sel, cond, callback) => {
        // 100毫秒后，检查dom效果
        setTimeout(() => {
            // 但验证条件为true
            if (cond($(sel))) {
                // 执行回调函数
                callback();
            }
        }, 100);
    },
    // 切换显示
    toggleShow: (cond, sel) => {
        // 获得选择器对象
        let s = $(sel);
        // 检查条件
        let checkCond = (s) => {
            return s.hasClass('hide')
        };
        // 满足条件
        if (cond) {
            // 显示被选对象
            s.removeClass('hide');
        } else {
            // 隐藏被选对象
            s.addClass('hide');
            checkCond = (s) => {
                return !s.hasClass('hide')
            };
        }
        // 定义再次执行方法
        let and = () => {
            _.toggleShow(cond, sel);
        };
        // 检查dom效果
        _.checkDom(sel, checkCond, and);
    },
    // 设置父容器className
    setParentsClassName: (e, parents, className) => {
        let p = $(e.target).parents(parents);
        p.addClass(className);
        return p;
    },
    // 滚动相关处理
    scrollBottom: {
        init: () => {
            $(document).scroll(function() {
                let viewH = $('body').height(), //可见高度
                    contentH = $('#app').height(), //内容高度
                    scrollTop = $('body').scrollTop(); //滚动高度
                if (scrollTop / (contentH - viewH) >= 0.75) { //到达底部100px时,加载新内容
                    // 调用滚到底部函数
                    _.scrollBottom.trigger();
                }
            });
        },
        cache: {},
        add: (id, func) => {
            _.scrollBottom.cache[id] = func;
        },
        remove: (id) => {
            delete _.scrollBottom.cache[id];
        },
        trigger: () => {
            for (let id in _.scrollBottom.cache) {
                let func = _.scrollBottom.cache[id];
                _.isFunction(func) && func();
            }
        }
    }

});
// 订阅滚动事件
// _.scrollBottom.init();