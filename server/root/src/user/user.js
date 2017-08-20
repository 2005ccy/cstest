
// 生成加密字符串
import SHA256 from "crypto-js/sha256";
// svg 验证码
import svgCaptcha from 'svg-captcha';
// 加载accessToken组件
import Token from './token.js';

const token = new Token();

// 用户相关操作类
export default class User extends Base {

    // 密码加密密钥
    pwdSecret = 'pwd.timestamp.sha256'

    // 构造方法
    constructor() {
        super();
    }

    // 创建设备数据
    async saveDevice(device) {
        // 构建mongo实例
        let mongo = await new Mongo('device');
        // 向数据库插入数据
        return await mongo.insert(device);
    }

    // 创建访客用户
    async saveGuest(guest) {
        // 构建mongo实例
        let mongo = await new Mongo('guest');
        // 向数据库插入数据
        return await mongo.insert(guest);
    }

    // 生成游客accessToken
    guestAccessToken(req, res) {

        // 获得设备信息
        let device = req.body;
        // 设置设备唯一编号
        device._id = `${_.now()}.system.device`;

        // 构建用户数据
        let user = {
            _id: `${_.now()}.system.guest`,
            roles: ['guest'],
            devices: [device._id],
            address: device.address
        }

        // 保存设备信息
        let ret = this.saveDevice(device);
        // 保存游客信息
        ret = ret && this.saveGuest(user);
        // 构建token访问字符串
        ret = ret && token.buildToken(device, user);
        // 输出结果
        this.response(res, ret);
    }

    // 刷新当前 access_token
    refreshAccessToken(req, res) {
        // 获取access_token

        // 如果有效，产生一个新的access_token

    }

    // 用户注册
    registe(req, res) {

        if (!this.checkCaptcha(req.body.captcha)) {
            res.json({
                ok: false,
                code: 'CAPTCHA_ERROR',
                msg: '验证码错误'
            });
            return;
        }

        let ts = _.now();
        // 获取注册数据
        let data = _.extend({
            timestamp: ts
        }, req.body);

        data._id = `${ts}.${ data.mobile || data.email }`;
        data.password = this.crypto(data.password, data.timestamp);
        delete data.captcha;
        delete data.agreement;
        delete data.confirm;

        // 构建mongo实例
        let mongo = new Mongo('users');
        // 向数据库插入数据
        mongo.insert(data, res);
    }


    // 密码加密算法
    crypto(pwd, now) {
        return SHA256(`${pwd}.${pwdSecret}.${now}`).toString();
    }

    // 检查验证码是否相同
    checkCaptcha(captcha) {
        let reg = new RegExp(`^${captcha}$`, "i");
        return false;
    }

    // 验证输入验证码
    validCaptcha(req, res) {
        let c = req.params.captcha;

        let r = {
            ok: true
        }
        if (!this.checkCaptcha(c)) {
            r = {
                ok: false
            }
        }
        res.status(200).json(r);
    }

    // 获取注册验证码
    getCaptcha(req, res) {
        let opt = {
            size: 4,
            ignoreChars: '0o1i',
            noise: 3
        };
        var captcha = svgCaptcha.create(opt);

        // res.set('Content-Type', 'image/svg+xml');
        res.status(200).send(captcha.data);
    }


    // 完成用户登录
    login(req, res) {
        // 1. 获取用户名、密码

        // 2. 判断用户名，类型（用户名、邮箱、手机）

        // 3. 查询用户数据

        // 4. 比对用户密码

        // 5. 登录成功，返回access_token

        // 构建访问token, 
        let token = this.buildToken(data);
        // 写出登录成功token
        res.json({
            ok: true,
            access_token: token
        });
    }

    // 完成用户登出
    logout(req, res) {
        req.logout();
        res.redirect('/');
    }

}