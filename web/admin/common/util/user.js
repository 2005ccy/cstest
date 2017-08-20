
// 扩展 _ 方法
Object.assign(_, {
    // 设置access_token 别名
    token: 'access_token',
    // 获取浏览器userAgent 信息
    userAgent: () => {
        // 加载依赖资源
        return csGetCache('//cdn.bootcss.com/UAParser.js/0.7.12/ua-parser.min.js').then(() => {
            // 声明对象
            let parser = new UAParser();
            // 返回浏览器user agent信息
            return parser.getResult();
        });
    },
    // 获取用户ip及地址信息
    getIp: () => {
        // 加载依赖资源
        return csGetCache('http://pv.sohu.com/cityjson?ie=utf-8').then(() => {
            return returnCitySN;
        })
    },
    // 检查用户是否存在accessToken
    checkAccessToken: async () => {
        // 如果用户不存在accessToken
        if (!_.getItem(_.token)) {
            // 获取用户ip地址信息
            let ip = await _.getIp();
            // 获取用户user agent 信息
            let userAgent = await _.userAgent();
            // 获取浏览器屏幕信息
            let screen = window.screen;

            let device = {};
            // 设置屏幕信息
            device.screen = _.pick(screen, ['availHeight', 'availWidth', 'height', 'width']);
            // 设置ip地址信息
            device.address = ip;
            // 设置系统信息
            device.os = userAgent.os;
            // 设置浏览器信息
            device.browser = userAgent.browser;
            // 设置内核引擎
            device.engine = userAgent.engine;

            // 发起获取access_token 请求
            db.user.getAccessToken(device).ajax().then((data) => {
                data[_.token] && _.setItem(_.token, data[_.token]);
            })
        }
    }
});