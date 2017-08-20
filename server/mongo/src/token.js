// 登录验证组件
const passport = require('passport');
// http参数验证组件
const Strategy = require('passport-http-bearer').Strategy;
// 加密解密组件
const jwt = require('jsonwebtoken');

// 需返回的对象
let ret = {};

// 使用策略设置，用户信息
passport.use(new Strategy(function(token, cb) {

    // 转义token
    let tobj = ret.restoreToken(token);

    jwt.verify(tobj.token, ret.tokenSecret(tobj.timestamp), {
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

// 构建 access_token 构建秘钥
ret.tokenSecret = (timestamp) => {
    return `${timestamp}.${ret.loginSecret}`;
};

// 转换token
ret.changeToken = (timestamp, token) => {
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
ret.restoreToken = (token) => {
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
ret.buildToken = function(param, context) {
    let _this = this;
    // 构建token 数据
    let user = param.user;
    let userId = user._id;
    let device = param.device;
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
    jwt.sign(data, ret.tokenSecret(timestamp), {
        algorithm: 'HS256'
    }, function(err, asyncToken) {
        if (err) {
            _this.reject(err);
            return;
        }
        _this.resolve(ret.changeToken(timestamp, asyncToken));
    });
}
worker.oper('user.accesstoken.buildToken', '!c.user.accesstoken.saveGuest.error && !c.user.accesstoken.saveDevice.error', ret.buildToken, true);

// 构建用户信息拦截中间件
ret.authenticate = (req, res, next) => {
    // 进行用户验证
    passport.authenticate('bearer', {
        session: false
    })(req, res, next);
}

// 导出token 组件
module.exports = ret;