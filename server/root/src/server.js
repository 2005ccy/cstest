// 导入gzip压缩组件
import compression from 'compression';
// 导入express组件
import express from 'express';
// 事件处理器
import EventProcessor from './event/event-processor.js';
// 导入事件类
import './event/event.js';

// 导入路由事件
import SystemRoute from './route/system.js';

// 实例化express 对象
const app = express();
// 进行gzip压缩
app.use('/', compression());


// 构建事件处理器
const EP = new EventProcessor();

// 触发系统路由事件
EP.event(SystemRoute).props({
    app: app
}).do();


// 定义服务端口
const port = 18080;
// 系统监听端口，并启动服务
app.listen(port, function() {
    console.log(`url: http://127.0.0.1:${port}/, server start!!`);
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
