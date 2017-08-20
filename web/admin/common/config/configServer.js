var envs = [

    // 生产环境
    {
        // active: true,
        step: 'https://step.newtouch.com',
        work: 'https://www.newtouch.com',
        code: 'https://step.newtouch.com',
        sso: 'https://sso.newtouch.com'
    },
    // 测试环境
    {
        // active: true,
        step: 'https://step.newtouchwork.com',
        work: 'https://www.newtouchwork.com',
        code: 'https://step.newtouchwork.com',
        sso: 'https://sso.newtouchwork.com'
    },
    // 压测环境
    {
        // active: true,
        step: 'http://ntsstresstest-host34.sh2.newtouch.com:45080',
        work: 'http://ntsstresstest-host34.sh2.newtouch.com:45079',
        code: 'http://218.245.64.3:45080',
        sso: 'http://218.245.64.3:45434'
    },
    // mock环境
    {
        active: true,
        step: 'http://223.167.85.2:46511',
        work: 'http://223.167.85.2:46511',
        code: 'http://223.167.85.2:46511',
        sso: 'https://sso.newtouchwork.com'
    }
];

var env = envs[0];

for (var i in envs) {
    if (envs[i].active) {
        env = envs[i];
        break;
    }
}

module.exports = env;