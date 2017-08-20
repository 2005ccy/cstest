
// 扩展 _ 方法
Object.assign(_, {
    // 截取字符串
    substring: (str, start, end) => {
        if (_.isString(str)) {
            let si = str.indexOf(start);
            if (si > -1) {
                si = si + start.length;
                let ei = str.indexOf(end, si);
                ei = ei < 0 ? str.length : ei;
                return str.substring(si, ei);
            }
        }
        return str;
    },
    // 获取当前日期
    nowDate: () => {
        return moment().format('YYYY-MM-DD');
    },
    // 将时间转换为字符串
    timeStr: (date, format) => {
        // 时间无效
        if (!date) {
            return null;
        }
        // 设置时间对象
        let m = date;
        // 如果不是moment对象
        if (!moment.isMoment(date)) {
            // 转换为moment对象
            m = moment(date);
            // 如果moment对象无效, 返回null
            if (!m._isValid) {
                return null;
            }
        }
        // 格式化字符串
        return m.format(format);
    },
    // 获取日期
    getDate: (date) => {
        return _.timeStr(date, 'YYYY-MM-DD');
    },
    // 获取时间
    getTime: (date) => {
        return _.timeStr(date, 'YYYY-MM-DD HH:mm');
    },
    // 获取时间
    getTimes: (date) => {
        return _.timeStr(date, 'YYYY-MM-DD HH:mm:ss');
    },
    // 返回错误承诺对象
    reject: (err) => {
        let dfd = $.Deferred();
        dfd.reject(err);
        return dfd.promise();
    },
    // 返回正确承诺对象
    resolve: (data) => {
        let dfd = $.Deferred();
        dfd.resolve(data);
        return dfd.promise();
    },
    // 返回超时正确对象
    resolveTimeout: (data, mills) => {
        let dfd = $.Deferred();
        setTimeout(() => {
            dfd.resolve(data);
        }, mills || 100);
        return dfd.promise();
    },
    // 组件是否已经被卸载
    isUnMount: (component) => {
        return !component || component.isUnMount || component._calledComponentWillUnmount;
    },
    // 发现元素，或取第一个元素
    findOrFirst: (list, cond) => {
        // 返回空对象
        if (!_.isArray(list) || _.isEmpty(list)) {
            return {};
        }
        // 返回符合条件，或第一个数据
        let obj = _.find(list, cond);
        // 如果数据无，返回第一个
        if (!obj) {
            return list[0];
        }
        // 返回查询到的对象
        return obj;
    },
    // 调用指定函数
    call: (func, ...params) => {
        return _.isFunction(func) && func(...params);
    },
    // 统一轮巡器
    interval: {
        // 轮巡数组
        map: {},
        // 单次轮询毫秒数
        once: 100,
        // 添加轮巡函数
        add: (key, func, mills, timeout) => {
            if (_.isFunction(func)) {
                // 将回调加入轮巡数组
                _.interval.map[key] = {
                    f: func,
                    m: mills || _.interval.once,
                    n: mills || _.interval.once,
                    t: timeout
                };
            }
            !_.interval.interval && _.interval.start();
        },
        // 移除相关函数
        remove: (key) => {
            delete _.interval.map[key];
            if (_.isEmpty(_.interval.map)) {
                _.interval.stop();
            }
        },
        // 启动轮巡
        start: () => {
            // 启动轮巡
            _.interval.interval = setInterval(() => {
                window.requestAnimationFrame(() => {
                    // 遍历需轮巡的数组
                    for (let key in _.interval.map) {
                        // 获得单个轮巡对象
                        let inter = _.interval.map[key];
                        // 递减单次轮巡毫秒数
                        inter.n -= _.interval.once;
                        // 如果超时被设置
                        if (_.isNumber(inter.t)) {
                            // 递减超时
                            inter.t -= _.interval.once;
                            if (inter.t < 1) {
                                // 移除轮询器
                                _.interval.remove(key);
                                // 进行下次轮训
                                continue;
                            }
                        }
                        // 如果间隔，时间小于1
                        if (inter.n < 1) {
                            // 执行轮巡函数
                            inter.f();
                            // 重新赋值轮巡间隔
                            inter.n = inter.m;
                        }
                    }
                });
            }, _.interval.once);
        },
        // 停止轮询器
        stop: () => {
            clearInterval(_.interval.interval);
            _.interval.interval = null;
        }
    },
    // 生成uuid字符串 ==OK==
    uuid: () => {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    // 向数组加入第一个元素
    unshift: (list, obj, unique) => {
        if (!_.isArray(list) || !_.isObject(obj)) {
            return;
        }
        if (unique) {
            let r = _.find(list, obj);
            if (r) {
                return;
            }
        }
        list.unshift(obj);
    },
    // 表格中空白内容默认显示'--'
    initTable: (columns) => {
        _.map(columns, (col, i) => col.render = col.render || (text => text || '--'));
        return columns;
    },
    // 文件图标配置class
    fileType: `,exe:exe
                ,apk:apk
                ,psd:psd
                ,ai:ai
                ,vsd:vsd
                ,ipa,pxl,deb:ios
                ,js,sql,php,java,asp,aspx,css,inf,ini,key,mdb,apl,dyalog,pgp,asn,asn1
                ,b,bf,c,h,cpp,c++,cc,cxx,hpp,h++,hh,hxx,cob,cpy,cs,clj,cljc,cljx,cljs,gss
                ,cmake,cmake.in,coffee,cl,lisp,el,cyp,cypher,pyx,pxd,pxi,cr,cql,d,dart,diff
                ,patch,dtd,dylan,dyl,intr,ecl,edn,e,elm,ejs,erb,erl,factor,fcl,forth,fth,4th
                ,f,for,f77,f90,fs,s,feature,go,groovy,gradle,haml,hs,lhs,hx,hxml,pro,jade
                ,pug,jsp,json,map,jsonld,jsx,jl,kt,less,ls,lua,markdown,md,mkd,m,nb,mo,mps
                ,sql,mbox,nsh,nsi,nt,m,mm,ml,mli,mll,mly,oz,p,pas,jsonld,pl,pm,php3,php4,php5
                ,phtml,pig,conf,def,list,log,pls,ps1,psd1,psm1,properties,ini,in,proto,build,bzl
                ,py,pyw,pp,q,r,rst,spec,rb,rs,sas,sass,scala,scm,ss,scss,sh,ksh,bash,siv,sieve
                ,slim,st,tpl,solr,soy,rq,sparql,excel,formula,nut,styl,swift,ltx,v,tcl,toml
                ,1,2,3,4,5,6,7,8,9,ttcn,ttcn3,ttcnpp,cfg,ttl,ts,webidl,vb,vbs,vtl,v,vhd,vhdl
                ,vue,xml,xsl,xsd,xy,xquery,ys,yaml,yml,z80,mscgen,mscin,msc,xu,msgenny:code
                ,html,htm:html
                ,swf:swf
                ,torrent:torrent
                ,avi,rm,3gp,mp4,wma,wav,rmvb,flv:vedio
                ,doc,docx,wps:doc
                ,gif,jpeg,jpg,bmp,png,tif:img
                ,txt,text,textile:txt
                ,xls,xlsx:xls
                ,zip,rar,gz,7z,tar,cab,arj,lzh,ace,gzip,jar,ios:zip
                ,ppt,pptx:ppt
                ,mp3,wav,wmv:wav
                ,pdf:pdf
                ,`,
    // 根据文件类型，返回Class
    fileIconClass: (type) => {
        // 如果类别不存在
        if (!type) {
            // 返回目录图标
            return 'cs-file-icon dir';
        }
        // 设置查询字符串
        let ts = `,${type.toLocaleLowerCase()}`;
        // 查询文件类型索引
        let t = _.fileType.indexOf(ts);
        // 获得类型class开始索引
        let s = t > -1 ? _.fileType.indexOf(':', t + ts.length) : t;
        // 获取类型class结束索引
        let e = s > -1 ? _.fileType.indexOf(',', s + 1) : s;
        // 如果存在class
        if (s > -1 && e > s) {
            // 返回文件class
            return `cs-file-icon ${_.fileType.substring(s + 1, e)}`;
        }
        // 没有找到class
        return 'cs-file-icon other';
    },
    // 根据url，返回文件图标Class
    fileIcon: (url, select) => {
        // 获取文件类型
        let us = url && url.split('.');
        // 获得文件类型
        let type = _.size(us) > 1 ? us.pop() : null;
        // 返回文件图标class
        let cls = _.fileIconClass(type);
        // 如果存在文件图标class
        if (cls) {
            // 获得jquery查询器
            let sel = $(select);
            // 选择器存在
            if (sel.length > 0) {
                window.requestAnimationFrame(() => {
                    // 背景图片懒加载
                    _.lazyImg.dom(sel, '/images/file-icon/file-icon.png');
                    // 设置选择器class
                    sel.addClass(cls);
                });
            }
        }
    },
    // 过滤对象值
    filterObj: (obj) => {
        let ret = {};
        for (let k in obj) {
            let val = obj[k];
            if (val) {
                ret[k] = val;
            }
        }
        return ret;
    },
    // 获取文件名字
    // https://xxx.xxx.xxx/xxx.jpg => xxx.jpg
    getFileName: (imageURL) => {
        return _.last(_.split(imageURL, '/'));
    },
    // 对form进行缓存
    componentCache: {},
    // 设置form到缓存
    setComponent: (id, form) => {
        _.componentCache[id] = form;
    },
    // 获取缓存的form
    getComponent: (id) => {
        return _.componentCache[id];
    },
    // 删除缓存的form
    removeComponent: (id) => {
        delete _.componentCache[id];
    },
});