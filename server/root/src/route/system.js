
// 构建系统路由
export default class SystemEvent extends Event {

    // 事件完成挂载
    eventDidMount() {
        this.props.app.all('*', this.cors);
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