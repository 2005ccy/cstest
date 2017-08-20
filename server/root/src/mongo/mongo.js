
// 导入mongoclient, ObjectID 连接组件
import { MongoClient, ObjectID } from 'mongodb';
// 导入mongo连接池
import poolModule from 'generic-pool';

// 构建mongo连接池
const mongoPool = poolModule.createPool({
    create: function(callback) {
        return MongoClient.connect(config.mongo.url);
    },
    destroy: function(client) {
        return client.close();
    }
}, {
    max: config.mongo.max,
    min: config.mongo.min,
    idleTimeoutMillis: config.mongo.idleTimeoutMillis
});


// mongo单个请求类
export default class Mongo extends Base {

    // 构造方法
    constructor(colls) {
        super();
        this.colls = colls;
        this.finally = this.close;
        this.open();
    }

    // 打开数据库链接
    async open() {
        this.db = await mongoPool.acquire();
        this.col = this.db && await this.db.collection(this.colls);
    }

    // 关闭数据库链接
    async close() {
        this.db && await mongoPool.release(this.db);
    }

    // 进行分页查询
    async pagination(pageNo, pageSize = 10) {
        if (pageNo) {
            // 如果为第一页
            if (pageNo == 1) {
                // 获取当前条件下，数据条数
                this.count = await this.cursor.count();
            }
            // 计算跳过条数
            let skip = (pageNo - 1) * pageSize;
            // 如果跳过数量，大于0
            if (skip > 0) {
                // 设置游标跳过
                this.cursor = await this.cursor.skip(skip);
            }
            // 设置返回数量，并返回集合
            this.cursor = await this.cursor.limit(pageSize);
        }
        // 返回对象本身，支持访问链
        return this;
    }

    // 对集合进行排序
    async sort(sort) {
        // 存在数据库游标
        if (this.cursor) {
            // 对游标进行排序
            this.cursor = this.cursor.sort(sort);
        }
        // 返回对象本身，支持访问链
        return this;
    }

    // 返回查询数据
    async toArray(res) {
        // 查询
        let items;
        if (this.cursor) {
            items = await this.cursor.toArray();
        }
        // 构建返回数据
        let ret = {
            count: this.count,
            items: items
        };
        // 响应对象输出结果
        this.response(res, ret);
        // 返回请求结果
        return ret;
    }

    // 根据条件与字段查询集合
    async find(query = {}, fields) {
        // 存在数据库链接
        if (this.col) {
            // 返回的查询结果
            this.cursor = await this.col.find(query, fields);
        }
        return this;
    }

    // 查询单条数据
    async findOne(docId, res) {
        let doc;
        // 存在数据库链接
        if (this.col && _.isString(docId)) {
            // 返回的查询结果
            doc = await this.col.findOne({
                '_id': docId
            });
        }
        // 响应对象输出结果
        this.response(res, doc);
        // 返回请求结果
        return doc;
    }

    // 向集合添加数据
    async insert(items, res) {
        let ret;
        if (this.col && !_.isEmpty(items)) {
            // 如果没有查询到数据
            if (_.isArray(items)) {
                // 插入多条数据
                ret = await this.col.insertMany(items);
            } else {
                // 插入单条数据
                ret = await this.col.insertOne(items);
            }
        }
        // 响应对象输出结果
        this.response(res, ret);
        // 返回请求结果
        return ret;
    }

    // 更新单条数据
    async update(docId, item, res) {
        let ret;
        if (this.col && _.isString(docId) && !_.isEmpty(item)) {
            // 删除_id 主键
            delete item._id;
            // 更新数据结果
            ret = await this.col.updateOne({
                '_id': docId
            }, {
                '$set': item
            });
        }
        // 响应对象输出结果
        this.response(res, ret);
        // 返回请求结果
        return ret;
    }

    // 删除集合元素
    async delete(docId, res) {
        let ret;
        if (this.col && _.isString(docId)) {
            // 更新数据结果
            ret = await this.col.deleteOne({
                '_id': docId
            });
        }
        // 响应对象输出结果
        this.response(res, ret);
        // 返回请求结果
        return ret;
    }
}
// 定义全局Mongo对象
global.Mongo = Mongo;