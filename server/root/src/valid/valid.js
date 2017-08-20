
// 权限验证类
export default class Valid extends Base {

    // 数据描述
    data =[{
        name: 'server', // 服务器数据
        organiz: 'system', // 系统
        all: ['admin'] // 所有操作 'admin' 角色
    }, {
        name: 'product', // 产品数据
        organiz: 'custom', // 自定义
        get: {
            guest: ['name', 'price', '']
        }
    }, {
        name: 'role', // 角色表
        organiz: 'custom', // 自定义组织
        all: ['admin'], // 
    }]

    // 成员信息描述
    user = {
        organiz: 'company.hr', // 公司人事部
        roles: ['admin',]
    }

    // 访问路径配置数据
    roles =[{
        method: 'all', // [all, get, post, put, delete]
        path: '/p/server',
        roles: ['admin'],
        paramRule: {
            name: [{
            }]
        }
    }];

    // 构造方法
    constructor(app) {
        super();
        this.app = app;
        init();
    }

    // 初始化方法
    init() {
        // 权限验证中间件
        this.app.use((req, res, next) => {
            // 分解请求url
            let ps = req.path.split('/');
            // 获取访问标识
            let tag = ps[1];
            // 获取集合名称
            let col = ps[2];
            // 免登陆访问
            if (tag === 'u') {
                next();
            // 需登录访问
            } else {

            }
            next();
        });
    }

}