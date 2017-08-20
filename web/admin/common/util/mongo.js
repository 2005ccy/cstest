// 扩展 _ 方法
Object.assign(_, {
    // 将过滤条件，变为mongo查询条件
    $in: (filters) => {
        let r = {};
        for (let k in filters) {
            if (_.isEmpty(filters[k])) {
                continue;
            }
            r[k] = {
                $in: filters[k]
            };
        }
        return r;
    },
    // 构建mongo排序条件
    $sort: (sorter) => {
        if (_.isEmpty(sorter)) {
            return null;
        }
        let asc = sorter.order === 'descend' ? -1 : 1;
        return {
            [sorter.field]: asc
        }
    }
});