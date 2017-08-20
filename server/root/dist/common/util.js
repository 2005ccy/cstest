'use strict';

var _ = require('lodash');
// 导入正则解析path组件
var pathToRegexp = require('path-to-regexp');

// 扩展全局 _ 对象
global._ = Object.assign(_, {
    // 正则表达式
    regex: {
        // 手机正则
        mobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    },
    // 获取指定字段对象
    getObjectByFields: function getObjectByFields(obj, fieldArr) {
        var ret = {};
        for (var k in obj) {
            var v = obj[k];
            if (fieldArr.includes(k)) {
                ret[k] = v;
            }
        }
        return ret;
    },
    // 获取排除字段对象
    getObjectNotFields: function getObjectNotFields(obj, fieldArr) {
        var ret = {};
        for (var k in obj) {
            var v = obj[k];
            if (!fieldArr.includes(k)) {
                ret[k] = v;
            }
        }
        return ret;
    },
    // 路径匹配
    pathMatch: function pathMatch(regStr, path) {
        // 参数无效，匹配失败
        if (!regStr || !path) {
            return false;
        }
        // 去除参数
        path = path.split('?')[0];
        // 如果字符串相等
        if (regStr == path) {
            // 匹配成功
            return true;
        }
        // 构建正则对象
        var re = pathToRegexp(regStr, []);
        // 匹配path
        var ra = re.exec(path);
        // 如果有匹配结果
        if (!_.isEmpty(ra)) {
            // 匹配成功
            return true;
        }
        // 匹配失败
        return false;
    },
    // 匹配一组规则，一个成功，则全部成功
    pathMatchArr: function pathMatchArr(regStrArr, path) {
        // 参数无效匹配失败
        if (!_.isArray(regStrArr) || !path) {
            return false;
        }
        // 遍历路径数组
        for (var i in regStrArr) {
            // 获取当个路径
            var regStr = regStrArr[i];
            // 匹配路径
            if (_.pathMatch(regStr, path)) {
                // 匹配成功
                return true;
            }
        }
        // 匹配失败
        return false;
    },
    // 生成uuid字符串 ==OK==
    uuid: function uuid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
        return uuid;
    }

});
//# sourceMappingURL=util.js.map