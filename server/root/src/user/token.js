// 登录验证组件
import passport from 'passport';
// http参数验证组件
import { Strategy } from 'passport-http-bearer';
// 加密解密组件
import jwt from 'jsonwebtoken';

// 构建请求token字符串
export default class Token extends Base {

    // 构建串秘钥
    loginSecret = 'secret';

    // 构造方法
    constructor() {
        super();
        this.init();
    }

    // 类的初始化方法
    init() {
        // 使用策略设置，用户信息
        passport.use(new Strategy(function(token, cb) {

            // 转义token
            let tobj = this.restoreToken(token);

            jwt.verify(tobj.token, this.tokenSecret(tobj.timestamp), {
                algorithms: ['HS256']
            }, function(err, decoded) {
                if (err) {
                    // token 过期、或是签名错误等、尝试获取数据
                    decoded = jwt.decode(tobj.token) || {};
                    // 登录过期
                    decoded.expired = true;
                // 验证错误
                // return cb(err);
                }
                // 输出用户信息
                cb(null, decoded);
            });
        }));
    }

    // 构建 access_token 构建秘钥
    tokenSecret(timestamp) {
        return `${timestamp}.${this.loginSecret}`;
    }

    // 转换token
    changeToken(timestamp, token) {
        let ts = `${timestamp}.`;
        let newToken = '';
        for (let i in token) {
            newToken += token[i];
            if (ts[i]) {
                newToken += ts[i];
            }
        }
        return newToken;
    }

    // 分离token中 token、timestamp
    restoreToken(token) {
        let ts = '';
        let t = '';
        for (let i = 0; i < token.length; i = i + 2) {
            let t2 = token[i + 1] || '';

            t += token[i];
            if (!_.endsWith(ts, '.')) {
                ts += t2;
            } else {
                t += t2;
            }
        }
        // 返回结果
        return {
            timestamp: ts && ts.substring(0, ts.length - 1),
            token: t
        };
    }

    // 构建更完善token
    buildToken(device, user) {
        let _this = this;
        // 构建token 数据
        let userId = user._id;
        let deviceId = device._id;
        let now = Math.floor(Date.now() / 1000);
        now += device.browser ? 60 * 60 : 60 * 60 * 24 * 365;
        let data = {
            userId: userId,
            deviceId: deviceId,
            roles: user.roles,
            exp: now
        };
        // 构建时的毫秒数
        let timestamp = _.now();
        // 根据数据，生成token数据
        let t = jwt.sign(data, this.tokenSecret(timestamp), {
            algorithm: 'HS256'
        });
        return this.changeToken(timestamp, t);
    }

    // 构建用户信息拦截中间件
    authenticate(req, res, next) {
        // 进行用户验证
        passport.authenticate('bearer', {
            session: false
        })(req, res, next);
    }
}