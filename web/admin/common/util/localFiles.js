
// 扩展 _ 方法
Object.assign(_, {

    // 检查字符串
    canLocalFilesStr: 'canLocalFiles is true',
    // 能否缓存文件
    // canLocalFiles: false,
    // 现有缓存数据
    localFilesArr: (() => {
        return _.getItem('cs-localFilesArr') || {};
    })(),
    // 缓存文件内容
    setContents: (key, content) => {
        // 如果能本地存储文件
        if (_.canLocalFiles) {
            try {
                // 进行文件本地存储
                return csStorage.setContents(key.replace(/[\/\.]/g, '-'), content).done(() => {
                    // 保存成功，进行数组赋值
                    _.localFilesArr[key] = true;
                    // 重新赋值数组
                    _.setItem('cs-localFilesArr', _.localFilesArr);
                });
            } catch ( e ) {
                return _.resolve(_.setItem(key, content));
            }
        } else {
            // 如果不能，则放入localStorage
            return _.resolve(_.setItem(key, content));
        }
    },
    // 获取文件内容
    getContents: (key) => {
        // 如果支持文件存储，且包含文件
        if (_.localFilesArr[key]) {
            try {
                // 获取存储内容
                return csStorage.getContents(key.replace(/[\/\.]/g, '-'));
            } catch ( e ) {
                return _.reject(e);
            }
        } else {
            // 如果不能，则取localStorage内容
            return _.resolve(_.getItem(key));
        }
    }
});