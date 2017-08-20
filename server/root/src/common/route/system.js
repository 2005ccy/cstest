// 导入域组件
import domain from 'domain';

// 系统操作类
export default class System extends Base {

    // 构造方法
    constructor(app) {
        super();
        this.app = app;
        this.init();
    }

    // 初始化方法
    init() {
        // 支持跨域
        this.app.all('*', this.cors);
    }

    // 跨域支持
    cors(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

        if (req.method == 'OPTIONS') {
            res.send(200); //让options请求快速返回
        } else {
            next();
        }
    }
}