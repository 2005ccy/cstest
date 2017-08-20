'use strict';
// 导入gzip压缩组件
const compression = require('compression');
// 导入express组件
const express = require('express');
// post 参数解析
const bodyParser = require('body-parser');

// 加载工具方法
require('./util');
// 导入配置文件，并设置global.config
require('./config');
// 导入日志组件
require('./log4.js');
// 导入工作流对象
require('./worker');
// 导入accessToken解析器
const token = require('./token.js');
// 获取mongo路由对象
const routeMongo = require('./mongo');

// 获取app 对象
const app = express();
// 绑定18080 端口
let port = 18080;

// 使用gzip压缩数值
// app.use('/', compression());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());
// 加载token中间件
app.use(token.authenticate);

// 查询集合所有数据、或某条件所有数据、非分页查询
app.get('/p/:collection/', routeMongo.getColl);
// 某用户查询某集合某数据
app.get('/p/:collection/:docId', routeMongo.getDoc);
// 某用户向集合添加数据
app.post('/p/:collection/', routeMongo.insertDoc);
// 某用户修改某集合某数据
app.put('/p/:collection/:docId', routeMongo.updateDoc);
// 某用户删除某集合某数据
app.delete('/p/:collection/:docId', routeMongo.deleteDoc);

// 如果为开发环境，则修改端口号
if (isDevEnv) {
    port = 18082;
}
// 服务启动
app.listen(port, function() {
    console.log(`url: http://127.0.0.1:${port}/, server start!!`);
});