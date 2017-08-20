'use strict';

// 导入co 组件
const co = require('co');
// 导入mongoclient 连接组件
const MongoClient = require('mongodb').MongoClient;
// mondo _id 对象
const ObjectID = require('mongodb').ObjectID;
// 导入mongo连接池
const poolModule = require('generic-pool');

/**
 * [operates 操作器对象]
 * @return {[type]}       [description]
 */
let mongo = function() {
    let exp = {};

    // mongoDB 数据库连url
    exp.url = config.mongo.url;
    // mongoDB 最大连接数
    exp.connectSize = config.mongo.connectSize;
    // mongo db 连接池
    exp.dbPool = {};

    console.info('coming in mongo');

    // 构建mongo连接池
    let mongoPool = poolModule.createPool({
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

    /**
     * [getCollection 查询某集合数据]
     * @param  {[type]} action  [当前行动对象]
     * @param  {[type]} res     [操作上下文]
     * @return {[type]}         [description]
     */
    exp.getCollection = function(param, context) {
        // 获得集合名称
        let collection = param.collection;
        // 查询参数
        let query = param.query;
        let _this = this;

        co(function*() {
            // 获得 mongo 连接
            let db = yield mongoPool.acquire();
            if (!db) logger.error('Fail to acquire one mongo connection');

            try {
                // 获得操作的集合
                let col = db.collection(collection);
                // 返回的查询结果
                let cursor = col.find(query.query, query.fields);
                ;
                // 如果存在过滤字段，设置排序器
                if (query.sort) {
                    cursor = cursor.sort(query.sort);
                }
                // 设置当前页码
                let pageNo = query.pageNo;
                // 设置每页条数
                let pageSize = query.pageSize || 10;
                // 该条件下，数据个数
                let count = query.count;
                // 返回数据
                let ret = {};
                // 如果存在页码
                if (pageNo && pageNo == 1) {
                    // 获取当前条件下，数据条数
                    count = yield cursor.count();
                    // 限制查询数据条数
                    if (count > 1000) {
                        // 返回最大条数
                        count = 1000;
                    }
                    // 设置数据条数
                    ret.count = count;
                }
                // 如果是分页查询
                if (pageNo) {
                    // 如果查询的数据为 0， 返回空集合
                    if (count === 0) {
                        ret.items = [];
                    // 如果是少量数据，使用 skip + limit
                    } else {
                        // 计算跳过条数
                        let skip = (pageNo - 1) * pageSize;
                        // 如果跳过数量，大于0
                        if (skip > 0) {
                            // 设置游标跳过
                            cursor = cursor.skip(skip);
                        }
                        // 设置返回数量，并返回集合
                        ret.items = yield cursor.limit(pageSize).toArray();
                    }
                // 查询该条件下，所有数据
                } else {
                    ret.items = yield cursor.toArray();
                }
                // 返回查询结果
                _this.resolve(ret);
            } catch ( e ) {
                _this.reject(e);
            } finally {
                mongoPool.release(db);
            }
        }).catch((err) => {
            _this.reject(err);
        })
    }

    worker.oper('mongo.getCollection', 'isString(p.collection) && isDefined(p.query)', exp.getCollection, true);
    worker.flow('mongo.getCollection', [worker.opers.mongo.getCollection]);

    /**
     * [getDocument 查询某数据详情]
     * @param  {[type]} resolve [承诺成功回调]
     * @param  {[type]} reject  [承诺失败回调]
     * @param  {[type]} action  [当前行动对象]
     * @param  {[type]} res     [操作上下文]
     * @return {[type]}         [description]
     */
    exp.getDocument = function(param, context) {

        // 集合名称
        let collection = param.collection;
        // 数据编号
        let docId = param.docId;
        let _this = this;
        co(function*() {
            // 获得 mongo 连接
            let db = yield mongoPool.acquire();
            if (!db) logger.error('Fail to acquire one mongo connection');

            try {
                // 获得操作的集合
                let col = db.collection(collection);
                // 查询到的结果数组
                let doc = yield col.findOne({
                    '_id': docId
                });
                // 如果没有查询到数据
                if (!doc && ObjectID.isValid(docId)) {
                    // 尝试使用 mongo id 查询数据
                    doc = yield col.findOne({
                        '_id': new ObjectID(docId)
                    });
                }
                // 返回查询结果
                _this.resolve(doc);
            } catch ( e ) {
                _this.reject(e);
            } finally {
                mongoPool.release(db);
            }
        }).catch((err) => {
            _this.reject(err);
        })
    }

    worker.oper('mongo.getDocument', 'isString(p.collection) && isString(p.docId)', exp.getDocument, true);
    worker.flow('mongo.getDocument', [worker.opers.mongo.getDocument]);

    /**
     * [postCollection 向集合添加数据]
     * @param  {[type]} resolve [承诺成功回调]
     * @param  {[type]} reject  [承诺失败回调]
     * @param  {[type]} action  [当前行动对象]
     * @param  {[type]} res     [操作上下文]
     * @return {[type]}         [description]
     */
    exp.postCollection = function(param, context) {

        // 集合名称
        let collection = param.collection;
        // 查询到的结果数组
        let body = param.body;
        let _this = this;

        co(function*() {
            // 获得 mongo 连接
            let db = yield mongoPool.acquire();
            if (!db) logger.error('Fail to acquire one mongo connection');

            try {
                // 查询当前集合，避免新增集合
                let items = yield db.listCollections({
                    name: collection
                }).toArray();
                // 如果存在集合
                if (items.length > 0) {
                    // 获得操作的集合
                    let col = db.collection(collection);
                    // 处理结果
                    let r;
                    // 如果没有查询到数据
                    if (_.isArray(body)) {
                        // 插入多条数据
                        r = yield col.insertMany(body);
                    } else {
                        // 插入单条数据
                        r = yield col.insertOne(body);
                    }
                    // 返回查询结果
                    _this.resolve(r);
                } else {
                    _this.reject('collection not exists!!');
                }
            } catch ( e ) {
                _this.reject(e);
            } finally {
                mongoPool.release(db);
            }
        }).catch((err) => {
            _this.reject(err);
        })
    }

    worker.oper('mongo.postCollection', 'isString(p.collection) && isObject(p.body)', exp.postCollection, true);
    worker.flow('mongo.postCollection', [worker.opers.mongo.postCollection]);

    /**
     * [putDocument 更新某数据]
     * @param  {[type]} resolve [承诺成功回调]
     * @param  {[type]} reject  [承诺失败回调]
     * @param  {[type]} action  [当前行动对象]
     * @param  {[type]} res     [操作上下文]
     * @return {[type]}         [description]
     */
    exp.putDocument = function(param, context) {

        // 集合名称
        let collection = param.collection;
        // 数据编号
        let docId = param.docId;
        // 查询到的结果数组
        let body = param.body;
        // 删除_id 主键
        delete body._id;

        let _this = this;
        co(function*() {
            // 获得 mongo 连接
            let db = yield mongoPool.acquire();
            if (!db) logger.error('Fail to acquire one mongo connection');

            try {
                // 获得操作的集合
                let col = db.collection(collection);
                // 处理结果
                // 更新数据结果
                let r = yield col.updateOne({
                    '_id': docId
                }, {
                    '$set': body
                });
                // 返回查询结果
                _this.resolve(r);
            } catch ( e ) {
                _this.reject(e);
            } finally {
                mongoPool.release(db);
            }
        }).catch((err) => {
            _this.reject(err);
        })
    }

    worker.oper('mongo.putDocument', 'isString(p.collection) && isString(p.docId) && isObject(p.body)', exp.putDocument, true);
    worker.flow('mongo.putDocument', [worker.opers.mongo.putDocument]);

    /**
     * [deleteDocument 删除某数据]
     * @param  {[type]} resolve [承诺成功回调]
     * @param  {[type]} reject  [承诺失败回调]
     * @param  {[type]} action  [当前行动对象]
     * @param  {[type]} res     [操作上下文]
     * @return {[type]}         [description]
     */
    exp.deleteDocument = function(param, context) {

        // 集合名称
        let collection = param.collection;
        // 数据编号
        let docId = param.docId;

        let _this = this;
        co(function*() {
            // 获得 mongo 连接
            let db = yield mongoPool.acquire();
            if (!db) logger.error('Fail to acquire one mongo connection');

            try {
                // 获得操作的集合
                let col = db.collection(collection);
                // 更新数据结果
                let r = yield col.deleteOne({
                    '_id': docId
                });
                // 返回查询结果
                _this.resolve(r);
            } catch ( e ) {
                _this.reject(e);
            } finally {
                mongoPool.release(db);
            }
        }).catch((err) => {
            _this.reject(err);
        })
    }

    worker.oper('mongo.deleteDocument', 'isString(p.collection) && isString(p.docId)', exp.deleteDocument, true);
    worker.flow('mongo.deleteDocument', [worker.opers.mongo.deleteDocument]);

    return exp;
}
mongo();

let ret = {};

// 某用户删除某集合某数据
ret.deleteDoc = (req, res) => {
    // 集合名称
    let collection = req.params.collection;
    // 文档编号
    let docId = req.params.docId;

    worker.flows.mongo.deleteDocument.do({
        collection: collection,
        docId: docId
    }, res);
};

// 某用户修改某集合某数据
ret.updateDoc = (req, res) => {
    // 集合名称
    let collection = req.params.collection;
    // 文档编号
    let docId = req.params.docId;
    // 更新数据
    let body = _.clone(req.body);

    worker.flows.mongo.putDocument.do({
        collection: collection,
        docId: docId,
        body: req.body
    }, res);
};

// 某用户向集合添加数据
ret.insertDoc = (req, res) => {
    // 集合名称
    let collection = req.params.collection;
    // 提交数据
    let body = _.clone(req.body);

    worker.flows.mongo.postCollection.do({
        collection: collection,
        body: req.body
    }, res);
};

// 某用户查询某集合某数据
ret.getDoc = (req, res) => {
    // 集合名称
    let collection = req.params.collection;
    // 文档编号
    let docId = req.params.docId;

    worker.flows.mongo.getDocument.do({
        collection: collection,
        docId: docId
    }, res);
};

// 查询集合所有数据、或某条件所有数据、非分页查询
ret.getColl = (req, res) => {
    // 集合名称
    let collection = req.params.collection;
    let query = _.clone(req.query);

    worker.parse(query);

    worker.flows.mongo.getCollection.do({
        collection: collection,
        query: query
    }, res);
};

module.exports = ret;
