
// 扩展 _ 国际化方法
Object.assign(_, {
    // i18n国际化对象
    i18n: {
        // 当前语言类型
        lang: 'zh',
        // 当前语言包
        map: {},
        // 缓存语言包
        cache: {},
        // 国际化消息
        message: (key, param) => {
            // 返回国际化消息
            let val = _.i18n.map[key] || key;
            // 如果存在参数
            if (!_.isEmpty(param)) {
                // 遍历参数
                for (let k in param) {
                    // 获得参数值
                    let v = param[k];
                    // 替换参数值
                    val = val.replace(new RegExp(`{${k}}`, 'g'), v);
                }
            }
            // 返回参数值
            return val;
        },
        // 加载初始化语言包
        init: (widget) => {
            // 设置中文
            let lang = 'zh';
            // 获取缓存语言
            let l = _.getItem('i18n_lang');
            // 设置语言值
            lang = l && 'null' != l ? l : lang;
            // 更改默认语言
            _.i18n.change(lang, widget);
        },
        // 加载语言包
        load: (lang) => {
            // 设置lang
            _.i18n.lang = lang;
            // 获取缓存语言
            _.setItem('i18n_lang', lang);
            // 获得指定语音包
            let m = _.i18n.cache[lang];
            // 语音包存在
            if ('zh' == lang || m) {
                // 设置i18n当前语言包
                _.i18n.map = m || {};
                // 返回正确状态
                return _.resolve();
            } else {
                // 加载所需语言包
                return csGetCache(cacheMap[lang]).done((data) => {
                    // 设置当前语言
                    _.i18n.map = window[`csI18n${lang}`];
                    // 缓存当前语言
                    _.i18n.cache[lang] = _.i18n.map;
                });
            }
        },
        // 切换语言
        change: (lang, widget) => {
            // 加载语言包
            return _.i18n.load(lang).done(() => {
                // 设置国际化修改时间戳
                _.i18n.langStamp = _.now();
                // 获取用户浏览器标识
                let ua = navigator.userAgent || '';
                // 如果浏览器为 ie9
                if (_.includes(ua, 'MSIE 9')) {
                    // 设置所有当前组件，时间戳
                    _.setCurWidgetsLang(_.i18n.langStamp);
                } else {
                    // 进行路由刷新
                    widget && _.isFunction(widget.refresh) && widget.refresh();
                }
            });
        }
    }
});