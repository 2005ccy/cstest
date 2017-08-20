// 扩展 _ 方法
Object.assign(_, {
    // 输出验证error
    validError: (callback) => {
        return (xhr, sts, err) => {
            callback(_.xhrError(xhr))
        }
    },
    // 获取错误信息error
    xhrError: (xhr) => {
        return xhr && xhr.responseJSON && xhr.responseJSON.message;
    },
    // 获取当前域名
    getDomain: () => {
        let m = location.href.match(/[^\.]+(?=\.com)/);
        if (!_.isEmpty(m)) {
            return `${m[0]}.com`;
        }
        return m;
    },
    // 临时存储
    storage: {},
    // 设置localStorage
    setItem: (k, v) => {
        try {
            if (_.isObject(v)) {
                v = JSON.stringify(v);
            }
        } catch ( e ) {};
        // 浏览器支持 localStorage
        if (typeof localStorage !== 'undefined') {
            try {
                // 设置信息
                localStorage.setItem(k, v);
            } catch ( e ) {};
        } else {
            // 临时存储
            _.storage[k] = v;
        }
    },
    // 获取localStorage
    getItem: (k) => {
        // 取出缓存中的值
        try {
            let v = typeof localStorage !== 'undefined' ? localStorage.getItem(k) : _.storage[k];
            if (_.includes(v, '[') || _.includes(v, '{')) {
                v = JSON.parse(v);
            }
            return v;
        } catch ( e ) {}
        return null;
    },
    // 删除localStorage 中的值
    removeItem: (k) => {
        if (typeof localStorage !== 'undefined') {
            // 删除存储值
            try {
                localStorage.removeItem(k);
            } catch ( e ) {}
        } else {
            // 删除存储值
            delete _.storage[k];
        }
    },
    // 设置cookie
    setCookie: (k, v) => {
        // 加载cookie 插件
        return csGetCache('//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js').then(() => {
            if ($.cookie && _.isEmpty($.cookie.defaults)) {
                $.cookie.json = false;
                $.cookie.defaults.expires = 365;
                $.cookie.defaults.path = "/";
                $.cookie.defaults.domain = _.getDomain();
            }
            // 设置cookie
            $.cookie(k, v);
        });
    },
    // 删除cookie
    removeCookie: (k) => {
        _.isFunction($.removeCookie) && $.removeCookie(k);
    },
    //获取浏览器cookie 方法扩展
    getCookie: (k) => {
        try {
            var allcookies = document.cookie;
            var cookie_pos = allcookies.indexOf(k);

            if (cookie_pos != -1) {
                cookie_pos += k.length + 1;
                var cookie_end = allcookies.indexOf(";", cookie_pos);

                if (cookie_end == -1) {
                    cookie_end = allcookies.length;
                }
                var value = unescape(allcookies.substring(cookie_pos, cookie_end));
                var m = value.match('"(.*)"');
                if (m) {
                    return m[1];
                }
                return value;
            }
        } catch ( e ) {}
    },
    // url参数
    urlParam: (url) => {
        let r = {};
        if (_.isString(url)) {
            let ps = url.split(/[?&=]/);
            for (let i = 1; i < ps.length; i += 2) {
                r[ps[i]] = ps[i + 1];
            }
        }
        return r;
    },
    // 跳转到锚点
    jumpAnchor: () => {
        // 清除定时
        clearTimeout(_.anchorTimeout);
        // 获取当前url
        let href = location.href;
        // 如果url包含# 锚点规则
        if (href.includes('#')) {
            // 获取锚点值
            let m = href.split('#')[1];
            // 查找对应的锚点
            let s = $(`[name="${m}"]`);
            // 如果锚点dom，不存在
            if (s.length < 1) {
                // 定时执行锚点跳转
                _.anchorTimeout = setTimeout(() => {
                    // 继续执行锚点跳转
                    _.jumpAnchor();
                }, 100);
            } else {
                // 如果锚点不存在 ‘jumped’ class
                if (!s.hasClass('jumped')) {
                    // 清除其余class
                    $('.jumped').removeClass('jumped');
                    // 添加‘jumped’ class
                    s.addClass('jumped');
                    // 如果当前锚点，相同
                    if (location.hash.indexOf(m) > -1) {
                        // 先清空锚点
                        location.hash = '';
                    }
                    // 执行当前锚点跳转
                    location.hash = m;
                    _.defer(() => {
                        window.scrollTo(0, $(window).scrollTop() - 60)
                    })
                }
            }
        }
    },
    // 获取url 连接字符串
    urlSpace: (url) => {
        let sp = '&';
        if (_.endsWith(url, '?')) {
            sp = '';
        } else if (!url.includes('?')) {
            sp = '?'
        }
        return sp;
    },
    // 阻止弹错url
    loseError: (url) => {
        return url ? `${url}${_.urlSpace(url)}LOSE_AJAX_ERROR_MESSAGE` : url;
    },
    // 阻止重置表单
    loseResetFields: (url) => {
        return url ? `${url}${_.urlSpace(url)}LOSE_RESET_FIELDS` : url;
    },
    // 阻止跳转到登录页面
    loseUnLogin: (url) => {
        return url ? `${url}${_.urlSpace(url)}LOSE_UNLOGIN` : url;
    },
    // spin 相关请求处理
    spin: {
        reqList: [],
        spinList: [],
        addReq: (url) => {
            _.spin.reqList.push(url);
            _.spin.loadingSpin(_.size(_.spin.reqList) - 1);
        },
        removeReq: (url) => {
            let i = _.findIndex(_.spin.reqList, (u, i) => {
                return u === url;
            });
            if (i > -1) {
                _.spin.reqList.splice(i, 1);
                let id = _.spin.spinList[i];
                _.spin.stopSpin(id);
            }
            _.spin.emptyCheck();
        },
        emptyCheck: () => {
            if (_.size(_.spin.reqList) < 1) {
                _.each(_.spin.spinList, (id, i) => {
                    _.spin.stopSpin(id);
                });
                _.spinList = [];
                // 配置轮询任务
                _.interval.remove('spin-interval');
            }
        },
        unMountSpin: (id) => {
            _.remove(_.spin.spinList, (i) => {
                return id === i;
            });
        },
        addSpin: (id) => {
            _.spin.spinList.push(id);
            // 配置轮询任务
            _.interval.add('spin-interval', _.spin.emptyCheck);
        },
        loadingSpin: (i) => {
            let spin = window.ajaxSpin && _.getComponent(window.ajaxSpin);
            if (!spin && i < _.spin.spinList.length) {
                let id = _.spin.spinList[i];
                if (id) {
                    spin = _.getComponent(id)
                }
            }
            spin && spin.setState({
                loading: true
            })
        },
        stopSpin: (id) => {
            if (id) {
                let spin = _.getComponent(id);
                spin && spin.setState({
                    loading: false
                })
            }
        }
    }

});