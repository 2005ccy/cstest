// post 参数解析
import bodyParser from 'body-parser';

// 用户实体操作类
import User from './user.js';
// 访问token操作类
import Token from './token.js';

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

export default class UserRoute extends Base {

    constructor(app) {
        super();
        this.app = app;
        this.init();
    }

    init() {
        // 构建依赖实体
        this.user = new User();
        this.token = new Token();

        // 拦截用户非登录请求
        this.app.use(this.setReqUser);

        // ===== 用户相关操作 =====
        // 获取用户accessToken
        this.app.post('/u/accesstoken/new', jsonParser, this.user.guestAccessToken);
        // 刷新用户accessToken
        this.app.get('/u/accesstoken/refresh', this.user.refreshAccessToken);
        // 声明用户登录请求
        this.app.post('/u/login', urlencodedParser, this.user.login);
        // 声明用户注销操作
        this.app.get('/u/logout', this.user.logout);
        // 用户注册
        this.app.post('/u/registe', urlencodedParser, this.user.registe);
        // 获取注册验证码
        this.app.get('/u/captcha', this.user.getCaptcha);
        // 验证输入验证码
        this.app.post('/u/captcha', urlencodedParser, this.user.validCaptcha);
    }

    // 构建用户信息，设置中间件
    setReqUser(req, res, next) {
        // 下列请求无需验证
        if (_.includes(['/u/captcha', '/u/registe', '/u/login', '/u/accesstoken/new', '/proxy/refresh'], req.path)) {
            next();
        } else {
            // 进行用户验证
            this.token.authenticate(req, res, next);
        }
    }

}