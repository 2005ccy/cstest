
// 扩展 _ 方法
Object.assign(_, {
    // 设置图片懒加载
    lazyImg: {
        // 默认图片
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDEvMTEvMTe6CQbjAAAADUlEQVQImWP4//8/AwAI/AL+hc2rNAAAAABJRU5ErkJggg==",
        // 全黑图片
        dark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAXdEVYdENyZWF0aW9uIFRpbWUAMjAxNy4zLjE36b13bwAAAA1JREFUCJljYGBg+A8AAQQBAH2yyN8AAAAASUVORK5CYII=",
        // localStorage缓存key
        storageKey: 'cs-base64-img-',
        // 懒加载图片
        map: {},
        // 已加载图片
        loaded: {},
        // dom图片懒加载
        domMap: {},
        // 已加载dom
        domLoaded: {},
        // 生成base64 画布对象
        canvas: {
            dom: null,
            context: null
        },
        // 启动图片懒加载
        start: () => {
            // 向dom 添加 canvas 对象
            $('body').append('<canvas id="cs-base64-img-canvas" style="display:none"></canvas>');
            // 获取 canvas 对象
            _.lazyImg.canvas.dom = $("#cs-base64-img-canvas")[0];
            // 获取对象上下午
            _.lazyImg.canvas.context = _.lazyImg.canvas.dom.getContext("2d");
            // 向dom 添加 透明图片
            $('body').append(`<img src="${_.lazyImg.default}" style="position:absolute;left:-999px;" id="cs-base64-bgimg"/>`);
            // 向dom 添加 全黑图片
            $('body').append(`<img src="${_.lazyImg.dark}" style="position:absolute;left:-999px;" id="cs-base64-bgimg-dark"/>`);
            // 获取图片对象
            _.lazyImg.bgImg = $('#cs-base64-bgimg')[0];
            // 获取全黑背景图片对象
            _.lazyImg.bgImgDark = $('#cs-base64-bgimg-dark')[0];
        },
        abovethetop: (ele, $window, $box) => {
            let fold = $window.scrollTop();
            if ($box && $box.length > 0) {
                fold = $box.offset().top;
            }
            return fold >= ele.offset().top + ele.height();
        },
        leftofbegin: (ele, $window, $box) => {
            let fold = $window.scrollLeft();
            if ($box && $box.length > 0) {
                fold = $box.offset().left;
            }
            return fold >= ele.offset().left + ele.width();
        },
        belowthefold: (ele, $window, $box) => {
            let fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
            if ($box && $box.length > 0) {
                fold = $box.offset().top + $box.height();
            }
            return fold <= ele.offset().top;
        },
        rightoffold: (ele, $window, $box) => {
            let fold = $window.width() + $window.scrollLeft();
            if ($box && $box.length > 0) {
                fold = $box.offset().left + $box.width();
            }
            return fold <= ele.offset().left;
        },
        // 图片可以展示
        isShow: (widget, $window, $box) => {
            let $this = $(`#${widget.id}`);
            if (!$this.is(":visible")) {
                return false;
            }
            if (_.lazyImg.abovethetop($this, $window, $box) ||
                _.lazyImg.leftofbegin($this, $window, $box)) {
                /* Nothing. */
            } else if (!_.lazyImg.belowthefold($this, $window, $box) &&
                !_.lazyImg.rightoffold($this, $window, $box)) {
                return true;
            } else {

            }
            return false;
        },
        // 构建图片base64 图片
        buildBase64Img: (jqImg, url, remove) => {
            // 获取图片dom对象
            let img = jqImg[0];
            // 获取图片当前宽度
            let nw = img.width;
            // 获取图片当前高度
            let nh = img.height;
            // 如果图片不是默认图片
            if ((nw > 1 && nh > 1 && img.naturalWidth > 1 && img.naturalHeight > 1) && img.src != _.lazyImg.default) {

                let loader = new Image();
                loader.crossOrigin = "anonymous";

                loader.onload = () => {
                    // 设置画布宽度 为 图片当前宽度
                    _.lazyImg.canvas.dom.width = nw;
                    // 设置画布高度 为 图片当前高度
                    _.lazyImg.canvas.dom.height = nh;

                    let base64Str;
                    try {
                        // 清空canvas画面
                        _.lazyImg.canvas.context.clearRect(0, 0, nw, nh);
                        // 使用画布渲染图片，并根据图片原始大小 压缩到当前图片大小
                        _.lazyImg.canvas.context.drawImage(loader, 0, 0, loader.naturalWidth, loader.naturalHeight, 0, 0, nw, nh);
                        // 获取base64 输出类型
                        let type = url.indexOf('.jp') > -1 ? 'image/jpeg' : 'image/png';

                        // 使用画布，输出图片base64 字符串
                        base64Str = _.lazyImg.canvas.dom.toDataURL(type);
                    } catch ( e ) {}

                    // 如果图片base64 字节长度 小于 localStorage存储限制，且localStorage还有空间
                    if (base64Str && base64Str.length > 270 && _.lazyImg.usefulBase64(base64Str, nw, nh)) {
                        // 缓存base64字符串
                        let key = `${_.lazyImg.storageKey}${url}`;
                        _.setContents(key, base64Str);
                    }
                };

                loader.src = url;
            }
            // 删除图片对象
            remove && jqImg.remove();
        },
        // base64 字符串比较
        usefulCache: {},
        // 生成背景图片base64
        unitBgBuild: (key, bg, nw, nh) => {
            // 获取缓存bs 字符串
            let bs = _.lazyImg.usefulCache[key];
            // 如果不存在，则生成bs字符串
            if (!bs) {
                // 清空canvas画面
                _.lazyImg.canvas.context.clearRect(0, 0, nw, nh);
                // 使用画布渲染图片，并根据图片原始大小 压缩到当前图片大小
                _.lazyImg.canvas.context.drawImage(bg, 0, 0, 1, 1, 0, 0, nw, nh);
                // 使用画布，输出图片base64 字符串
                bs = _.lazyImg.canvas.dom.toDataURL('image/png');
                // 缓存base64字符串
                _.lazyImg.usefulCache[key] = bs;
            }
            return bs;
        },
        // 判断是否为有效base64Str
        usefulBase64: (base64Str, nw, nh) => {
            // 构建透明背景key
            let key = `${nw}x${nh}`;
            // 构建全黑背景key
            let darkKey = key + '.dark';

            // 构建透明背景base64
            let bs = _.lazyImg.unitBgBuild(key, _.lazyImg.bgImg, nw, nh);
            // 构建全黑背景base64
            let dbs = _.lazyImg.unitBgBuild(darkKey, _.lazyImg.bgImgDark);

            // 比较base64 字符串
            return bs != base64Str && dbs != base64Str;
        },
        // 存在base64图片
        hasBase64Img: (url) => {
            let key = `${_.lazyImg.storageKey}${url}`;
            return _.localFilesArr[key] || !!_.getItem(key);
        },
        // 图片是否已经加载
        isLoaded: (widget) => {
            // jquery 查询图片
            let $this = $(`#${widget.id}`);
            // 获取图片url
            let url = widget.props.src;
            // 组件被卸载，直接删除
            if ($this.length < 1) {
                return true;
            }
            // 当前图片src
            let imgSrc = $this[0].currentSrc || $this[0].src || $this[0].href || $this.attr('src');
            // 如果图片为默认图片，则返回false
            if (_.includes(imgSrc, _.lazyImg.default)) {
                return false;
            }
            // 如果存在base64 图片
            if (_.lazyImg.hasBase64Img(url)) {
                return true;
            }
            // 如果图片为真实图片
            if (_.endsWith(imgSrc, url)) {
                // 生成图片base64字符串
                _.lazyImg.buildBase64Img($this, url);
                // 加载成功
                return true;
            }
            // 加载失败
            return false;
        },
        // 背景图片是否已经加载
        isDomLoaded: (widget) => {
            // 获取jquery图片对象
            let $this = $(`#${widget.id}`);
            // 获取图片url
            let url = widget.url;
            // 组件被卸载，直接删除
            if ($this.length < 1) {
                return true;
            }
            // 当前图片src
            let imgSrc = $this.css('background-image');
            // 如果图片为默认图片，则返回false
            if (_.includes(imgSrc, _.lazyImg.default)) {
                return false;
            }
            // 如果存在base64图片
            if (_.lazyImg.hasBase64Img(url)) {
                return true;
            }
            // 判断图片是否为真实图片
            if (imgSrc.indexOf(url) > -1) {
                // 没有构建图片
                if (!widget.uuid) {
                    // 向body最近图片对象
                    widget.uuid = _.lazyImg.appendImg(url);
                    // 进入下次，完成base64 图片制作
                    return false;
                }
                // 生成图片base64字符串
                _.lazyImg.buildBase64Img($(`#${widget.uuid}`), url, true);
                // 加载成功
                return true;
            }
            return false;
        },
        // 查询图片base64 内容
        getBase64ImgStr: (url) => {
            let key = `${_.lazyImg.storageKey}${url}`;
            return _.getContents(key);
        },
        // 向body最近img
        appendImg: (url) => {
            let uuid = _.uuid();
            // 向dom 添加用于背景图片的img
            $('body').append(`<img id="${uuid}" src="${url}" style="position:absolute;left:-99999px;top:-99999px;"/>`);
            // 返回图片id
            return uuid;
        },
        // 放入轮巡器
        interval: () => {
            let $window = $(window);
            // 轮巡图片是否在视窗，准备加载
            for (let key in _.lazyImg.map) {
                // 取得组件
                let w = _.lazyImg.map[key];
                // 如果组件被卸载
                if (!w.jumpMount && _.isUnMount(w)) {
                    // 移除加载图片
                    _.lazyImg.remove(key);
                    // 继续循环
                    continue;
                }
                // 如果图片可见
                if (_.lazyImg.isShow(w, $window, w.props.box && $(w.props.box))) {
                    // 获取缓存base64 图片字符串
                    _.lazyImg.getBase64ImgStr(w.props.src).done((base64) => {
                        // 设置组件状态
                        w.setState({
                            status: 'loading',
                            base64: base64
                        });
                        // 删除该组件
                        _.lazyImg.loaded[key] = w;
                    });
                }
            }
            // 轮巡图片是否加载成功
            for (let key in _.lazyImg.loaded) {
                // 获取组件
                let w = _.lazyImg.loaded[key];
                // 如果组件被卸载
                if (!w.jumpMount && _.isUnMount(w)) {
                    // 移除加载图片
                    _.lazyImg.remove(key);
                    // 继续循环
                    continue;
                }
                // 如果图片已经
                if (_.lazyImg.isLoaded(w)) {
                    // 移除组件
                    _.lazyImg.remove(key);
                } else {
                    w.setState({
                        status: 'loaded'
                    });
                }
            }
            // 轮巡背景图片加载情况
            for (let key in _.lazyImg.domMap) {
                // 取得组件
                let w = _.lazyImg.domMap[key];
                // 如果图片可见
                if (_.lazyImg.isShow(w, $window)) {
                    // 获取缓存base64 图片字符串
                    _.lazyImg.getBase64ImgStr(w.url).done((base64) => {
                        window.requestAnimationFrame(() => {
                            // 初始化背景图片
                            $(`#${key}`).css('background-image', `url(${base64 ? base64 : w.url})`);
                        });
                        // 删除加载
                        _.lazyImg.domLoaded[key] = w;
                    });
                }
            }
            // 轮巡检查图片是否加载
            for (let key in _.lazyImg.domLoaded) {
                let w = _.lazyImg.domLoaded[key];
                if (_.lazyImg.isDomLoaded(w)) {
                    // 移除组件
                    _.lazyImg.remove(key);
                }
            }
        },
        // 删除容器中的图片
        remove: (key) => {
            delete _.lazyImg.map[key];
            delete _.lazyImg.loaded[key];
            delete _.lazyImg.domMap[key];
            delete _.lazyImg.domLoaded[key];
            if (_.isEmpty(_.lazyImg.map) &&
                _.isEmpty(_.lazyImg.loaded) &&
                _.isEmpty(_.lazyImg.domMap) &&
                _.isEmpty(_.lazyImg.domLoaded)) {
                // 设置图片懒加载轮巡
                _.interval.remove('common.util.lodash.lazyImg');
            }
        },
        // 添加组件
        add: (widget) => {
            // 放置懒加载容器
            if (widget) {
                _.lazyImg.map[widget.id] = widget;
                // 设置图片懒加载轮巡
                _.interval.add('common.util.lodash.lazyImg', _.lazyImg.interval);
            }
        },
        // 添加dom组件
        dom: (sel, url) => {
            let lazy = false;
            // 遍历选择器
            $(_.selector(sel)).each(function() {
                // 获取元素id
                let uuid = $(this).attr('id');
                // 如果不存在id，则新增id
                if (!uuid) {
                    // 计算uuid
                    uuid = _.uuid();
                    // 设置id 为uuid
                    $(this).attr('id', uuid);
                }
                // 放置数据
                _.lazyImg.domMap[uuid] = {
                    id: uuid,
                    url: url
                };
                // 初始化背景图片
                $(this).css('background-image', `url(${_.lazyImg.default})`);
                lazy = true;
            });
            // 设置图片懒加载轮巡
            lazy && _.interval.add('common.util.lodash.lazyImg', _.lazyImg.interval);
        }
    },

});
// 启动图片懒加载
_.lazyImg.start();