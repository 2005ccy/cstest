import UserList from 'pages/admin/user/list';
import ServerList from 'pages/admin/server/list';

// 客户端相关配置
let ClientConfig = () => {

    // 管理后台，菜单配置文件
    let adminMenu = [{
        icon: 'appstore-o',
        name: '用户管理',
        child: [{
            name: '用户列表',
            link: '/b/user/list',
            component: UserList
        }]
    }, {
        icon: 'appstore',
        name: '权限管理',
        child: [{
            name: '资源列表',
            link: '/b/auth/resouce',
            component: UserList
        }, {
            name: '角色树',
            link: '/b/auth/role',
            component: UserList
        }]
    }, {
        icon: 'appstore-o',
        name: '服务管理',
        child: [{
            name: '服务列表',
            link: '/b/server/list',
            component: ServerList
        }]
    }];


    return {
        adminMenu
    }
}

// 导出配置对象
module.exports = ClientConfig();