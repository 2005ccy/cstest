'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require('mongodb');

var _genericPool = require('generic-pool');

var _genericPool2 = _interopRequireDefault(_genericPool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// 导入mongoclient, ObjectID 连接组件

// 导入mongo连接池


// 构建mongo连接池
var mongoPool = _genericPool2.default.createPool({
    create: function create(callback) {
        return _mongodb.MongoClient.connect(config.mongo.url);
    },
    destroy: function destroy(client) {
        return client.close();
    }
}, {
    max: config.mongo.max,
    min: config.mongo.min,
    idleTimeoutMillis: config.mongo.idleTimeoutMillis
});

// mongo单个请求类

var Mongo = function (_Base) {
    _inherits(Mongo, _Base);

    // 构造方法
    function Mongo(colls) {
        _classCallCheck(this, Mongo);

        var _this = _possibleConstructorReturn(this, (Mongo.__proto__ || Object.getPrototypeOf(Mongo)).call(this));

        _this.colls = colls;
        _this.finally = _this.close;
        _this.open();
        return _this;
    }

    // 打开数据库链接


    _createClass(Mongo, [{
        key: 'open',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return mongoPool.acquire();

                            case 2:
                                this.db = _context.sent;
                                _context.t0 = this.db;

                                if (!_context.t0) {
                                    _context.next = 8;
                                    break;
                                }

                                _context.next = 7;
                                return this.db.collection(this.colls);

                            case 7:
                                _context.t0 = _context.sent;

                            case 8:
                                this.col = _context.t0;

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function open() {
                return _ref.apply(this, arguments);
            }

            return open;
        }()

        // 关闭数据库链接

    }, {
        key: 'close',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.t0 = this.db;

                                if (!_context2.t0) {
                                    _context2.next = 4;
                                    break;
                                }

                                _context2.next = 4;
                                return mongoPool.release(this.db);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function close() {
                return _ref2.apply(this, arguments);
            }

            return close;
        }()

        // 进行分页查询

    }, {
        key: 'pagination',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(pageNo) {
                var pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
                var skip;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!pageNo) {
                                    _context3.next = 13;
                                    break;
                                }

                                if (!(pageNo == 1)) {
                                    _context3.next = 5;
                                    break;
                                }

                                _context3.next = 4;
                                return this.cursor.count();

                            case 4:
                                this.count = _context3.sent;

                            case 5:
                                // 计算跳过条数
                                skip = (pageNo - 1) * pageSize;
                                // 如果跳过数量，大于0

                                if (!(skip > 0)) {
                                    _context3.next = 10;
                                    break;
                                }

                                _context3.next = 9;
                                return this.cursor.skip(skip);

                            case 9:
                                this.cursor = _context3.sent;

                            case 10:
                                _context3.next = 12;
                                return this.cursor.limit(pageSize);

                            case 12:
                                this.cursor = _context3.sent;

                            case 13:
                                return _context3.abrupt('return', this);

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function pagination(_x) {
                return _ref3.apply(this, arguments);
            }

            return pagination;
        }()

        // 对集合进行排序

    }, {
        key: 'sort',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_sort) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                // 存在数据库游标
                                if (this.cursor) {
                                    // 对游标进行排序
                                    this.cursor = this.cursor.sort(_sort);
                                }
                                // 返回对象本身，支持访问链
                                return _context4.abrupt('return', this);

                            case 2:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function sort(_x3) {
                return _ref4.apply(this, arguments);
            }

            return sort;
        }()

        // 返回查询数据

    }, {
        key: 'toArray',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(res) {
                var items, ret;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                // 查询
                                items = void 0;

                                if (!this.cursor) {
                                    _context5.next = 5;
                                    break;
                                }

                                _context5.next = 4;
                                return this.cursor.toArray();

                            case 4:
                                items = _context5.sent;

                            case 5:
                                // 构建返回数据
                                ret = {
                                    count: this.count,
                                    items: items
                                };
                                // 响应对象输出结果

                                this.response(res, ret);
                                // 返回请求结果
                                return _context5.abrupt('return', ret);

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function toArray(_x4) {
                return _ref5.apply(this, arguments);
            }

            return toArray;
        }()

        // 根据条件与字段查询集合

    }, {
        key: 'find',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var fields = arguments[1];
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!this.col) {
                                    _context6.next = 4;
                                    break;
                                }

                                _context6.next = 3;
                                return this.col.find(query, fields);

                            case 3:
                                this.cursor = _context6.sent;

                            case 4:
                                return _context6.abrupt('return', this);

                            case 5:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function find() {
                return _ref6.apply(this, arguments);
            }

            return find;
        }()

        // 查询单条数据

    }, {
        key: 'findOne',
        value: function () {
            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(docId, res) {
                var doc;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                doc = void 0;
                                // 存在数据库链接

                                if (!(this.col && _.isString(docId))) {
                                    _context7.next = 5;
                                    break;
                                }

                                _context7.next = 4;
                                return this.col.findOne({
                                    '_id': docId
                                });

                            case 4:
                                doc = _context7.sent;

                            case 5:
                                // 响应对象输出结果
                                this.response(res, doc);
                                // 返回请求结果
                                return _context7.abrupt('return', doc);

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function findOne(_x6, _x7) {
                return _ref7.apply(this, arguments);
            }

            return findOne;
        }()

        // 向集合添加数据

    }, {
        key: 'insert',
        value: function () {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(items, res) {
                var ret;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                ret = void 0;

                                if (!(this.col && !_.isEmpty(items))) {
                                    _context8.next = 11;
                                    break;
                                }

                                if (!_.isArray(items)) {
                                    _context8.next = 8;
                                    break;
                                }

                                _context8.next = 5;
                                return this.col.insertMany(items);

                            case 5:
                                ret = _context8.sent;
                                _context8.next = 11;
                                break;

                            case 8:
                                _context8.next = 10;
                                return this.col.insertOne(items);

                            case 10:
                                ret = _context8.sent;

                            case 11:
                                // 响应对象输出结果
                                this.response(res, ret);
                                // 返回请求结果
                                return _context8.abrupt('return', ret);

                            case 13:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function insert(_x8, _x9) {
                return _ref8.apply(this, arguments);
            }

            return insert;
        }()

        // 更新单条数据

    }, {
        key: 'update',
        value: function () {
            var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(docId, item, res) {
                var ret;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                ret = void 0;

                                if (!(this.col && _.isString(docId) && !_.isEmpty(item))) {
                                    _context9.next = 6;
                                    break;
                                }

                                // 删除_id 主键
                                delete item._id;
                                // 更新数据结果
                                _context9.next = 5;
                                return this.col.updateOne({
                                    '_id': docId
                                }, {
                                    '$set': item
                                });

                            case 5:
                                ret = _context9.sent;

                            case 6:
                                // 响应对象输出结果
                                this.response(res, ret);
                                // 返回请求结果
                                return _context9.abrupt('return', ret);

                            case 8:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function update(_x10, _x11, _x12) {
                return _ref9.apply(this, arguments);
            }

            return update;
        }()

        // 删除集合元素

    }, {
        key: 'delete',
        value: function () {
            var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(docId, res) {
                var ret;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                ret = void 0;

                                if (!(this.col && _.isString(docId))) {
                                    _context10.next = 5;
                                    break;
                                }

                                _context10.next = 4;
                                return this.col.deleteOne({
                                    '_id': docId
                                });

                            case 4:
                                ret = _context10.sent;

                            case 5:
                                // 响应对象输出结果
                                this.response(res, ret);
                                // 返回请求结果
                                return _context10.abrupt('return', ret);

                            case 7:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function _delete(_x13, _x14) {
                return _ref10.apply(this, arguments);
            }

            return _delete;
        }()
    }]);

    return Mongo;
}(Base);
// 定义全局Mongo对象


exports.default = Mongo;
global.Mongo = Mongo;
//# sourceMappingURL=mongo.js.map