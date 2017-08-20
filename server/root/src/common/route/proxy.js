// TODO 路由转发
import proxy from 'http-proxy-middleware';
// 导入mongo请求对象
import Mongo from '../../mongo/mongo.js';

// 代理器对象
export default class Proxy extends Base {

    // 字符串分隔符
    divide = '...';
    // 方法数组
    methods =['all', 'get', 'post', 'put', 'delete'];
    // 配置的服务Map
    serMap = {};
    // app 发布map
    appMap = {};

    // 代理器构造方法
    constructor(app) {
        super();
        this.app = app;
        this.init();
    }

    // 初始化方法
    init() {
        // 发布代理服务
        this.proxyPublish();
        this.app.get('/proxy/refresh', (req, res) => {
            this.proxyPublish();
            res.json({
                ok: true
            });
        })
    }

    // 查询服务器列表数据
    async serverList() {
        let mongo = await new Mongo('server');
        this.sers = await mongo.find().toArray();
    }

    // 整理代理数据
    proxyServer() {
        console.info('this.sers: ', this.sers);
        // 如果存在服务数据
        if (!_.isEmpty(this.sers)) {
            // 只获取，正常状态的服务
            this.sers = _.filter(this.sers, (ser) => {
                return ser.method && ser.url && ser.status === 'normal';
            });
            // 根据路由规则，对服务器进行分组
            this.serMap = _.groupBy(this.sers, (ser) => {
                return `${ser.method}${this.divide}${ser.path}`;
            });
        }
    }

    // 代理发布服务
    async proxyPublish() {
        // 获取服务器列表
        await this.serverList();
        // 对服务器列表进行数据转换
        this.proxyServer();
        // 遍历代理服务器
        _.each(this.serMap, (v, k) => {
            // 如果没有发布当前路由的，中间件
            if (_.isUndefined(this.appMap[k])) {
                // 分解请求字符串
                let sa = k.split(this.divide);
                // 获取请求方法
                let method = _.lowerCase(sa[0] || 'all');
                // 排除非法方法
                if (!_.includes(this.methods, method)) {
                    method = 'all';
                }
                // 获取请求路径
                let path = sa[1];
                // 发布路由中间件
                this.app[method](path, (req, res, next) => {
                    // 获取当前路由列表
                    let serList = this.serMap[k] || [];
                    // 获取请求计数
                    let now = this.appMap[k] + 1;
                    // 如果大于数组长度
                    if (now >= serList.length) {
                        // 从第一个开始
                        now = 0;
                    }
                    // 设置当前服务索引
                    this.appMap[k] = now;
                    // 获取当前服务
                    let cur = serList[now];
                    // 如果服务存在
                    if (cur) {
                        // 发起代理请求
                        proxy({
                            target: cur.url,
                            changeOrigin: true
                        })(req, res, next);
                    } else {
                        // TODO 发出短信报错

                        // 发出服务部存在，错误信息
                        res.json({
                            ok: false,
                            code: 'SERVER_NOT_EXISTS',
                            msg: '服务不存在'
                        })
                    }
                });
                // 设置服务请求索引
                this.appMap[k] = 0;
            }
        });
    }
}