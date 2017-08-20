// 构建集合类
db.user = db.build('user');

// 用户获取accessToken接口
db.user.api({
    name: 'getAccessToken',
    method: 'json',
    url: (param) => {
        return `/u/accesstoken/new`;
    }
});

// 检查用户是否存在access_token
_.checkAccessToken();

// 用户刷新accessToken
db.user.api({
    name: 'refreshAccessToken',
    url: (param) => {
        return `/u/accesstoken/refresh`;
    }
});

// 用户登录接口
db.user.api({
    name: 'login',
    method: 'post',
    url: (param) => {
        return `/u/login`;
    }
});

// 声明用户注销操作
db.user.api({
    name: 'logout',
    url: (param) => {
        return `/u/logout`;
    }
})

// 用户注册
db.user.api({
    name: 'registe',
    method: 'post',
    url: (param) => {
        return `/u/registe`;
    }
});

// 获取注册验证码
db.user.api({
    name: 'captcha',
    url: (param) => {
        return `/u/captcha`;
    }
});

// 验证输入验证码
db.user.api({
    name: 'checkCaptcha',
    url: (param) => {
        return `/u/captcha/${param.captcha}`;
    }
});
