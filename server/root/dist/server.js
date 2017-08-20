'use strict';

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _eventProcessor = require('./event/event-processor.js');

var _eventProcessor2 = _interopRequireDefault(_eventProcessor);

require('./event/event.js');

var _system = require('./route/system.js');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 实例化express 对象

// 导入事件类

// 导入express组件
var app = (0, _express2.default)();
// 进行gzip压缩


// 导入路由事件

// 事件处理器
// 导入gzip压缩组件
app.use('/', (0, _compression2.default)());

// 构建事件处理器
var EP = new _eventProcessor2.default();

// 触发系统路由事件
EP.event(_system2.default).props({
    app: app
}).do();

// 定义服务端口
var port = 18080;
// 系统监听端口，并启动服务
app.listen(port, function () {
    console.log('url: http://127.0.0.1:' + port + '/, server start!!');
});

// 加载工具方法
// import './common/util';
// 导入配置文件，并设置 global.config
// import './common/config';
// 导入日志组件，并设置 global.logger
// import './common/log4';
// 全局基类
// import './common/base.js';
// 全局加载Mongo
// import './mongo.js';

// 获取system路由对象
// import SysRouter from './common/route/system.js';
// // 引入代理对象
// import ProxyRouter from './common/route/proxy.js';
// // 获取user路由对象
// import UserRouter from './user/route.js';
// // 引入角色管理对象
// import roleFunc from './valid.js';

// app程序类
/*
class App extends Base {

    // 构造方法
    constructor() {
        super();
        this.init();
    }

    // 初始化方法
    init() {
        // 获取app对象
        const app = this.app = express();
        // 进行gzip压缩
        app.use('/', compression());

        // 实例化系统路由
        // new SysRouter(app);
        // // 用户操作路由
        // new UserRouter(app);
        // // 其他被代理的服务
        // new ProxyRouter(app);

        // // 拦截请求，用户角色与操作验证
        // roleFunc(app);

        // 启动服务
        this.start();
    }

    // 启动服务
    start() {
        // 定义服务端口
        const port = 18080;
        // 系统监听端口，并启动服务
        this.app.listen(port, function() {
            console.log(`url: http://127.0.0.1:${port}/, server start!!`);
        });
    }
}
// 构建实例，启动服务
new App();
*/
//# sourceMappingURL=server.js.map