(function(glob) {
    var undefined = {}.a;
    var Q = function(data) {
        var dfd = $.Deferred();
        dfd.resolve(data);
        return dfd.promise();
    };
    function definition(Q) {
        function PipeContext(handlers, nextMehod, end) {
            this._handlers = handlers;
            this._next = nextMehod;
            this._end = end;
            this._i = 0
        }
        ;PipeContext.prototype = {
            next: function() {
                this.__pipectx = this;return this._next.apply(this, arguments)
            },
            _nextHandler: function() {
                if (this._i >= this._handlers.length) return this._end;
                var handler = this._handlers[this._i].handler;
                this._i += 1;return handler;
            },
            length: function() {
                return this._handlers.length;
            }
        };
        function indexOfHandler(handlers, len, target) {
            for (var i = 0; i < len; ++i) {
                var handler = handlers[i];
                if (handler.name === target || handler.handler === target) {
                    return i
                }
            }
            return -1;
        }
        ;
        function forward(ctx) {
            return ctx.next.apply(ctx, Array.prototype.slice.call(arguments, 1));
        }
        ;
        function coerce(methodNames, handler) {
            methodNames.forEach(function(meth) {
                if (!handler[meth])
                    handler[meth] = forward
            });
        }
        ;var abstractPipeline = {
            addFirst: function(name, handler) {
                coerce(this._pipedMethodNames, handler);this._handlers.unshift({
                    name: name,
                    handler: handler
                });
            },
            addLast: function(name, handler) {
                coerce(this._pipedMethodNames, handler);this._handlers.push({
                    name: name,
                    handler: handler
                });
            },
            addAfter: function(target, name, handler) {
                coerce(this._pipedMethodNames, handler);
                var handlers = this._handlers;
                var len = handlers.length;
                var i = indexOfHandler(handlers, len, target);
                if (i >= 0) {
                    handlers.splice(i + 1, 0, {
                        name: name,
                        handler: handler
                    })
                }
            },
            addBefore: function(target, name, handler) {
                coerce(this._pipedMethodNames, handler);
                var handlers = this._handlers;
                var len = handlers.length;
                var i = indexOfHandler(handlers, len, target);
                if (i >= 0) {
                    handlers.splice(i, 0, {
                        name: name,
                        handler: handler
                    })
                }
            },
            replace: function(target, newName, handler) {
                coerce(this._pipedMethodNames, handler);
                var handlers = this._handlers;
                var len = handlers.length;
                var i = indexOfHandler(handlers, len, target);
                if (i >= 0) {
                    handlers.splice(i, 1, {
                        name: newName,
                        handler: handler
                    })
                }
            },
            removeFirst: function() {
                return this._handlers.shift()
            },
            removeLast: function() {
                return this._handlers.pop()
            },
            remove: function(target) {
                var handlers = this._handlers;
                var len = handlers.length;
                var i = indexOfHandler(handlers, len, target);
                if (i >= 0) handlers.splice(i, 1)
            },
            getHandler: function(name) {
                var i = indexOfHandler(this._handlers, this._handlers.length, name);
                if (i >= 0) return this._handlers[i].handler;
                return null
            }
        };
        function createPipeline(pipedMethodNames) {
            var end = {};
            var endStubFunc = function() {
                return end
            };
            var nextMethods = {};
            function Pipeline(pipedMethodNames) {
                this.pipe = {
                    _handlers: [],
                    _contextCtor: PipeContext,
                    _nextMethods: nextMethods,
                    end: end,
                    _pipedMethodNames: pipedMethodNames
                }
            }
            ;var pipeline = new Pipeline(pipedMethodNames);
            for (var k in abstractPipeline) {
                pipeline.pipe[k] = abstractPipeline[k]
            }
            pipedMethodNames.forEach(function(name) {
                end[name] = endStubFunc;
                nextMethods[name] = new Function("var handler = this._nextHandler();" + "handler.__pipectx = this.__pipectx;" + "return handler." + name + ".apply(handler, arguments);");
                pipeline[name] = new Function("var ctx = new this.pipe._contextCtor(this.pipe._handlers, this.pipe._nextMethods." + name + ", this.pipe.end);" + "return ctx.next.apply(ctx, arguments);")
            });return pipeline
        }
        ;createPipeline.isPipeline = function(obj) {
            return obj instanceof Pipeline
        };var utils = (function() {
            return {
                convertToBase64: function(blob, cb) {
                    var fr = new FileReader();
                    fr.onload = function(e) {
                        cb(e.target.result)
                    };
                    fr.onerror = function(e) {};
                    fr.onabort = function(e) {};fr.readAsDataURL(blob)
                },
                dataURLToBlob: function(dataURL) {
                    var BASE64_MARKER = ';base64,';
                    if (dataURL.indexOf(BASE64_MARKER) == -1) {
                        var parts = dataURL.split(',');
                        var contentType = parts[0].split(':')[1];
                        var raw = parts[1];
                        return new Blob([raw], {
                            type: contentType
                        })
                    }
                    var parts = dataURL.split(BASE64_MARKER);
                    var contentType = parts[0].split(':')[1];
                    var raw = window.atob(parts[1]);
                    var rawLength = raw.length;
                    var uInt8Array = new Uint8Array(rawLength);
                    for (var i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i)
                    }
                    return new Blob([uInt8Array.buffer], {
                        type: contentType
                    })
                },
                splitAttachmentPath: function(path) {
                    var parts = path.split('/');
                    if (parts.length == 1) parts.unshift('__nodoc__');
                    return parts
                },
                mapAsync: function(fn, promise) {
                    var deferred = $.Deferred();
                    promise.then(function(data) {
                        _mapAsync(fn, data, [], deferred)
                    }, function(e) {
                        deferred.reject(e)
                    });return deferred.promise()
                },
                countdown: function(n, cb) {
                    var args = [];
                    return function() {
                        for (var i = 0; i < arguments.length; ++i) args.push(arguments[i]);
                        n -= 1;
                        if (n == 0) cb.apply(this, args)
                    }
                }
            };
            function _mapAsync(fn, data, result, deferred) {
                fn(data[result.length], function(v) {
                    result.push(v);
                    if (result.length == data.length) deferred.resolve(result);else _mapAsync(fn, data, result, deferred)
                }, function(err) {
                    deferred.reject(err)
                })
            }
        })();
        var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        var persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage;
        var FilesystemAPIProvider = (function(Q) {
            function makeErrorHandler(deferred, finalDeferred) {
                return function(e) {
                    if (e.code == 1) {
                        deferred.resolve(undefined)
                    } else {
                        if (finalDeferred) finalDeferred.reject(e);else deferred.reject(e)
                    }
                }
            }
            ;
            function getAttachmentPath(docKey, attachKey) {
                docKey = docKey.replace(/\//g, '--');var attachmentsDir = docKey + "-attachments";
                return {
                    dir: attachmentsDir,
                    path: attachmentsDir + "/" + attachKey
                }
            }
            ;
            function readDirEntries(reader, result) {
                var deferred = $.Deferred();
                _readDirEntries(reader, result, deferred);return deferred.promise()
            }
            ;
            function _readDirEntries(reader, result, deferred) {
                reader.readEntries(function(entries) {
                    if (entries.length == 0) {
                        deferred.resolve(result)
                    } else {
                        result = result.concat(entries);_readDirEntries(reader, result, deferred)
                    }
                }, function(err) {
                    deferred.reject(err)
                })
            }
            ;
            function entryToFile(entry, cb, eb) {
                entry.file(cb, eb)
            }
            ;
            function entryToURL(entry) {
                return entry.toURL()
            }
            ;
            function FSAPI(fs, numBytes, prefix) {
                this._fs = fs;
                this._capacity = numBytes;
                this._prefix = prefix;
                this.type = "FileSystemAPI"
            }
            ;FSAPI.prototype = {
                getContents: function(path, options) {
                    var deferred = $.Deferred();
                    path = this._prefix + path;this._fs.root.getFile(path, {}, function(fileEntry) {
                        fileEntry.file(function(file) {
                            var reader = new FileReader();
                            reader.onloadend = function(e) {
                                var data = e.target.result;
                                var err;
                                if (options && options.json) {
                                    try {
                                        data = JSON.parse(data)
                                    } catch ( e ) {
                                        err = new Error('unable to parse JSON for ' + path)
                                    }
                                }
                                if (err) {
                                    deferred.reject(err)
                                } else {
                                    deferred.resolve(data)
                                }
                            };reader.readAsText(file)
                        }, makeErrorHandler(deferred))
                    }, makeErrorHandler(deferred));return deferred.promise()
                },
                setContents: function(path, data, options) {
                    var deferred = $.Deferred();
                    if (options && options.json)
                        data = JSON.stringify(data);
                    path = this._prefix + path;this._fs.root.getFile(path, {
                        create: true
                    }, function(fileEntry) {
                        fileEntry.createWriter(function(fileWriter) {
                            var blob;
                            fileWriter.onwriteend = function(e) {
                                fileWriter.onwriteend = function() {
                                    deferred.resolve()
                                };fileWriter.truncate(blob.size)
                            };
                            fileWriter.onerror = makeErrorHandler(deferred);
                            if (data instanceof Blob) {
                                blob = data
                            } else {
                                blob = new Blob([data], {
                                    type: 'text/plain'
                                })
                            }
                            fileWriter.write(blob)
                        }, makeErrorHandler(deferred))
                    }, makeErrorHandler(deferred));return deferred.promise()
                },
                ls: function(docKey) {
                    var isRoot = false;
                    if (!docKey) {
                        docKey = this._prefix;
                        isRoot = true
                    } else
                        docKey = this._prefix + docKey + "-attachments";
                    var deferred = $.Deferred();
                    this._fs.root.getDirectory(docKey, {
                        create: false
                    }, function(entry) {
                        var reader = entry.createReader();
                        readDirEntries(reader, []).then(function(entries) {
                            var listing = [];
                            entries.forEach(function(entry) {
                                if (!entry.isDirectory) {
                                    listing.push(entry.name)
                                }
                            });deferred.resolve(listing)
                        })
                    }, function(error) {
                        deferred.reject(error)
                    });return deferred.promise()
                },
                clear: function() {
                    var deferred = $.Deferred();
                    var failed = false;
                    var ecb = function(err) {
                        failed = true;deferred.reject(err)
                    };
                    this._fs.root.getDirectory(this._prefix, {}, function(entry) {
                        var reader = entry.createReader();
                        reader.readEntries(function(entries) {
                            var latch = utils.countdown(entries.length, function() {
                                if (!failed) deferred.resolve()
                            });
                            entries.forEach(function(entry) {
                                if (entry.isDirectory) {
                                    entry.removeRecursively(latch, ecb)
                                } else {
                                    entry.remove(latch, ecb)
                                }
                            });
                            if (entries.length == 0) deferred.resolve()
                        }, ecb)
                    }, ecb);return deferred.promise()
                },
                rm: function(path) {
                    var deferred = $.Deferred();
                    var finalDeferred = $.Deferred();
                    path = this._prefix + path;
                    var attachmentsDir = path + "-attachments";
                    this._fs.root.getFile(path, {
                        create: false
                    }, function(entry) {
                        entry.remove(function() {
                            deferred.promise().then(finalDeferred.resolve)
                        }, function(err) {
                            finalDeferred.reject(err)
                        })
                    }, makeErrorHandler(finalDeferred));this._fs.root.getDirectory(attachmentsDir, {}, function(entry) {
                        entry.removeRecursively(function() {
                            deferred.resolve()
                        }, function(err) {
                            finalDeferred.reject(err)
                        })
                    }, makeErrorHandler(deferred, finalDeferred));return finalDeferred.promise()
                },
                getAttachment: function(docKey, attachKey) {
                    var attachmentPath = this._prefix + getAttachmentPath(docKey, attachKey).path;
                    var deferred = $.Deferred();
                    this._fs.root.getFile(attachmentPath, {}, function(fileEntry) {
                        fileEntry.file(function(file) {
                            if (file.size == 0) deferred.resolve(undefined);else deferred.resolve(file)
                        }, makeErrorHandler(deferred))
                    }, function(err) {
                        if (err.code == 1) {
                            deferred.resolve(undefined)
                        } else {
                            deferred.reject(err)
                        }
                    });return deferred.promise()
                },
                getAttachmentURL: function(docKey, attachKey) {
                    var attachmentPath = this._prefix + getAttachmentPath(docKey, attachKey).path;
                    var deferred = $.Deferred();
                    var url = 'filesystem:' + window.location.protocol + '//' + window.location.host + '/persistent/' + attachmentPath;
                    deferred.resolve(url);return deferred.promise()
                },
                getAllAttachments: function(docKey) {
                    var deferred = $.Deferred();
                    var attachmentsDir = this._prefix + docKey + "-attachments";
                    this._fs.root.getDirectory(attachmentsDir, {}, function(entry) {
                        var reader = entry.createReader();
                        deferred.resolve(utils.mapAsync(function(entry, cb, eb) {
                            entry.file(function(file) {
                                cb({
                                    data: file,
                                    docKey: docKey,
                                    attachKey: entry.name
                                })
                            }, eb)
                        }, readDirEntries(reader, [])))
                    }, function(err) {
                        deferred.resolve([])
                    });return deferred.promise()
                },
                getAllAttachmentURLs: function(docKey) {
                    var deferred = $.Deferred();
                    var attachmentsDir = this._prefix + docKey + "-attachments";
                    this._fs.root.getDirectory(attachmentsDir, {}, function(entry) {
                        var reader = entry.createReader();
                        readDirEntries(reader, []).then(function(entries) {
                            deferred.resolve(entries.map(function(entry) {
                                return {
                                    url: entry.toURL(),
                                    docKey: docKey,
                                    attachKey: entry.name
                                }
                            }))
                        })
                    }, function(err) {
                        deferred.reject(err)
                    });return deferred.promise()
                },
                revokeAttachmentURL: function(url) {},
                setAttachment: function(docKey, attachKey, data) {
                    var attachInfo = getAttachmentPath(docKey, attachKey);
                    var deferred = $.Deferred();
                    var self = this;
                    this._fs.root.getDirectory(this._prefix + attachInfo.dir, {
                        create: true
                    }, function(dirEntry) {
                        deferred.resolve(self.setContents(attachInfo.path, data))
                    }, makeErrorHandler(deferred));return deferred.promise()
                },
                rmAttachment: function(docKey, attachKey) {
                    var attachmentPath = getAttachmentPath(docKey, attachKey).path;
                    var deferred = $.Deferred();
                    this._fs.root.getFile(this._prefix + attachmentPath, {
                        create: false
                    }, function(entry) {
                        entry.remove(function() {
                            deferred.resolve()
                        }, makeErrorHandler(deferred))
                    }, makeErrorHandler(deferred));return deferred.promise()
                },
                getCapacity: function() {
                    return this._capacity
                }
            };return {
                init: function(config) {
                    var deferred = $.Deferred();
                    if (!requestFileSystem) {
                        deferred.reject("No FS API");return deferred.promise()
                    }
                    var prefix = config.name + '/';
                    persistentStorage.requestQuota(config.size, function(numBytes) {
                        requestFileSystem(window.PERSISTENT, numBytes, function(fs) {
                            fs.root.getDirectory(config.name, {
                                create: true
                            }, function() {
                                deferred.resolve(new FSAPI(fs, numBytes, prefix))
                            }, function(err) {
                                console.error(err);deferred.reject(err)
                            })
                        }, function(err) {
                            console.error(err);deferred.reject(err)
                        })
                    }, function(err) {
                        console.error(err);deferred.reject(err)
                    });return deferred.promise()
                },
                isAvailable: function() {
                    return requestFileSystem != null
                }
            }
        })(Q);
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;
        var IndexedDBProvider = (function(Q) {
            var URL = window.URL || window.webkitURL;
            var convertToBase64 = utils.convertToBase64;
            var dataURLToBlob = utils.dataURLToBlob;
            function IDB(db) {
                this._db = db;
                this.type = 'IndexedDB';var transaction = this._db.transaction(['attachments'], 'readwrite');
                this._supportsBlobs = true;try {
                    transaction.objectStore('attachments').put(Blob(["sdf"], {
                        type: "text/plain"
                    }), "featurecheck")
                } catch ( e ) {
                    this._supportsBlobs = false
                }
            }
            ;IDB.prototype = {
                getContents: function(docKey) {
                    var deferred = $.Deferred();
                    var transaction = this._db.transaction(['files'], 'readonly');
                    var get = transaction.objectStore('files').get(docKey);
                    get.onsuccess = function(e) {
                        deferred.resolve(e.target.result)
                    };
                    get.onerror = function(e) {
                        deferred.reject(e)
                    };return deferred.promise()
                },
                setContents: function(docKey, data) {
                    var deferred = $.Deferred();
                    var transaction = this._db.transaction(['files'], 'readwrite');
                    var put = transaction.objectStore('files').put(data, docKey);
                    put.onsuccess = function(e) {
                        deferred.resolve(e)
                    };
                    put.onerror = function(e) {
                        deferred.reject(e)
                    };return deferred.promise()
                },
                rm: function(docKey) {
                    var deferred = $.Deferred();
                    var finalDeferred = $.Deferred();
                    var transaction = this._db.transaction(['files', 'attachments'], 'readwrite');
                    var del = transaction.objectStore('files').delete(docKey);
                    del.onsuccess = function(e) {
                        deferred.promise().then(function() {
                            finalDeferred.resolve()
                        })
                    };
                    del.onerror = function(e) {
                        deferred.promise().fail(function() {
                            finalDeferred.reject(e)
                        })
                    };
                    var attachmentsStore = transaction.objectStore('attachments');
                    var index = attachmentsStore.index('fname');
                    var cursor = index.openCursor(IDBKeyRange.only(docKey));
                    cursor.onsuccess = function(e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            cursor.delete();cursor.continue()
                        } else {
                            deferred.resolve()
                        }
                    };
                    cursor.onerror = function(e) {
                        deferred.reject(e)
                    };return finalDeferred.promise()
                },
                getAttachment: function(docKey, attachKey) {
                    var deferred = $.Deferred();
                    var transaction = this._db.transaction(['attachments'], 'readonly');
                    var get = transaction.objectStore('attachments').get(docKey + '/' + attachKey);
                    var self = this;
                    get.onsuccess = function(e) {
                        if (!e.target.result) {
                            deferred.resolve(undefined);return
                        }
                        var data = e.target.result.data;
                        if (!self._supportsBlobs) {
                            data = dataURLToBlob(data)
                        }
                        deferred.resolve(data)
                    };
                    get.onerror = function(e) {
                        deferred.reject(e)
                    };return deferred.promise()
                },
                ls: function(docKey) {
                    var deferred = $.Deferred();
                    if (!docKey) {
                        var store = 'files'
                    } else {
                        var store = 'attachments'
                    }
                    var transaction = this._db.transaction([store], 'readonly');
                    var cursor = transaction.objectStore(store).openCursor();
                    var listing = [];
                    cursor.onsuccess = function(e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            listing.push(!docKey ? cursor.key : cursor.key.split('/')[1]);cursor.continue()
                        } else {
                            deferred.resolve(listing)
                        }
                    };
                    cursor.onerror = function(e) {
                        deferred.reject(e)
                    };return deferred.promise()
                },
                clear: function() {
                    var deferred = $.Deferred();
                    var finalDeferred = $.Deferred();
                    var t = this._db.transaction(['attachments', 'files'], 'readwrite');
                    var req1 = t.objectStore('attachments').clear();
                    var req2 = t.objectStore('files').clear();
                    req1.onsuccess = function() {
                        deferred.promise().then(finalDeferred.resolve)
                    };
                    req2.onsuccess = function() {
                        deferred.resolve()
                    };
                    req1.onerror = function(err) {
                        finalDeferred.reject(err)
                    };
                    req2.onerror = function(err) {
                        finalDeferred.reject(err)
                    };return finalDeferred.promise()
                },
                getAllAttachments: function(docKey) {
                    var deferred = $.Deferred();
                    var self = this;
                    var transaction = this._db.transaction(['attachments'], 'readonly');
                    var index = transaction.objectStore('attachments').index('fname');
                    var cursor = index.openCursor(IDBKeyRange.only(docKey));
                    var values = [];
                    cursor.onsuccess = function(e) {
                        var cursor = e.target.result;
                        if (cursor) {
                            var data;
                            if (!self._supportsBlobs) {
                                data = dataURLToBlob(cursor.value.data)
                            } else {
                                data = cursor.value.data
                            }
                            values.push({
                                data: data,
                                docKey: docKey,
                                attachKey: cursor.primaryKey.split('/')[1]
                            });cursor.continue()
                        } else {
                            deferred.resolve(values)
                        }
                    };
                    cursor.onerror = function(e) {
                        deferred.reject(e)
                    };return deferred.promise()
                },
                getAllAttachmentURLs: function(docKey) {
                    var deferred = $.Deferred();
                    this.getAllAttachments(docKey).then(function(attachments) {
                        var urls = attachments.map(function(a) {
                            a.url = URL.createObjectURL(a.data);
                            delete a.data;
                            return a
                        });
                        deferred.resolve(urls)
                    }, function(e) {
                        deferred.reject(e)
                    });return deferred.promise()
                },
                getAttachmentURL: function(docKey, attachKey) {
                    var deferred = $.Deferred();
                    this.getAttachment(docKey, attachKey).then(function(attachment) {
                        deferred.resolve(URL.createObjectURL(attachment))
                    }, function(e) {
                        deferred.reject(e)
                    });return deferred.promise()
                },
                revokeAttachmentURL: function(url) {
                    URL.revokeObjectURL(url)
                },
                setAttachment: function(docKey, attachKey, data) {
                    var deferred = $.Deferred();
                    if (data instanceof Blob && !this._supportsBlobs) {
                        var self = this;
                        convertToBase64(data, function(data) {
                            continuation.call(self, data)
                        })
                    } else {
                        continuation.call(this, data)
                    }
                    function continuation(data) {
                        var obj = {
                            path: docKey + '/' + attachKey,
                            fname: docKey,
                            data: data
                        };
                        var transaction = this._db.transaction(['attachments'], 'readwrite');
                        var put = transaction.objectStore('attachments').put(obj);
                        put.onsuccess = function(e) {
                            deferred.resolve(e)
                        };
                        put.onerror = function(e) {
                            deferred.reject(e)
                        }
                    }
                    ;return deferred.promise()
                },
                rmAttachment: function(docKey, attachKey) {
                    var deferred = $.Deferred();
                    var transaction = this._db.transaction(['attachments'], 'readwrite');
                    var del = transaction.objectStore('attachments').delete(docKey + '/' + attachKey);
                    del.onsuccess = function(e) {
                        deferred.resolve(e)
                    };
                    del.onerror = function(e) {
                        deferred.reject(e)
                    };return deferred.promise()
                }
            };return {
                init: function(config) {
                    var deferred = $.Deferred();
                    var dbVersion = 2;
                    if (!indexedDB || !IDBTransaction) {
                        deferred.reject("No IndexedDB");return deferred.promise()
                    }
                    var request = indexedDB.open(config.name, dbVersion);
                    function createObjectStore(db) {
                        db.createObjectStore("files");var attachStore = db.createObjectStore("attachments", {
                            keyPath: 'path'
                        });
                        attachStore.createIndex('fname', 'fname', {
                            unique: false
                        })
                    }
                    ;request.onerror = function(event) {
                        deferred.reject(event)
                    };
                    request.onsuccess = function(event) {
                        var db = request.result;
                        db.onerror = function(event) {
                            console.log(event)
                        };
                        if (db.setVersion) {
                            if (db.version != dbVersion) {
                                var setVersion = db.setVersion(dbVersion);
                                setVersion.onsuccess = function() {
                                    createObjectStore(db);deferred.resolve()
                                }
                            } else {
                                deferred.resolve(new IDB(db))
                            }
                        } else {
                            deferred.resolve(new IDB(db))
                        }
                    };
                    request.onupgradeneeded = function(event) {
                        createObjectStore(event.target.result)
                    };return deferred.promise()
                },
                isAvailable: function() {
                    return indexedDB != null && IDBTransaction != null
                }
            }
        })(Q);
        var LocalStorageProvider = (function(Q) {
            return {
                init: function() {
                    return Q({
                        type: 'LocalStorage'
                    })
                }
            }
        })(Q);
        var openDb = window.openDatabase;
        var WebSQLProvider = (function(Q) {
            var URL = window.URL || window.webkitURL;
            var convertToBase64 = utils.convertToBase64;
            var dataURLToBlob = utils.dataURLToBlob;
            function WSQL(db) {
                this._db = db;
                this.type = 'WebSQL'
            }
            ;WSQL.prototype = {
                getContents: function(docKey, options) {
                    var deferred = $.Deferred();
                    this._db.transaction(function(tx) {
                        tx.executeSql('SELECT value FROM files WHERE fname = ?', [docKey], function(tx, res) {
                            if (res.rows.length == 0) {
                                deferred.resolve(undefined)
                            } else {
                                var data = res.rows.item(0).value;
                                if (options && options.json)
                                    data = JSON.parse(data);
                                deferred.resolve(data)
                            }
                        })
                    }, function(err) {
                        consol.log(err);deferred.reject(err)
                    });return deferred.promise()
                },
                setContents: function(docKey, data, options) {
                    var deferred = $.Deferred();
                    if (options && options.json)
                        data = JSON.stringify(data);
                    this._db.transaction(function(tx) {
                        tx.executeSql('INSERT OR REPLACE INTO files (fname, value) VALUES(?, ?)', [docKey, data])
                    }, function(err) {
                        console.log(err);deferred.reject(err)
                    }, function() {
                        deferred.resolve()
                    });return deferred.promise()
                },
                rm: function(docKey) {
                    var deferred = $.Deferred();
                    this._db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM files WHERE fname = ?', [docKey]);tx.executeSql('DELETE FROM attachments WHERE fname = ?', [docKey])
                    }, function(err) {
                        console.log(err);deferred.reject(err)
                    }, function() {
                        deferred.resolve()
                    });return deferred.promise()
                },
                getAttachment: function(fname, akey) {
                    var deferred = $.Deferred();
                    this._db.transaction(function(tx) {
                        tx.executeSql('SELECT value FROM attachments WHERE fname = ? AND akey = ?', [fname, akey], function(tx, res) {
                            if (res.rows.length == 0) {
                                deferred.resolve(undefined)
                            } else {
                                deferred.resolve(dataURLToBlob(res.rows.item(0).value))
                            }
                        })
                    }, function(err) {
                        deferred.reject(err)
                    });return deferred.promise()
                },
                getAttachmentURL: function(docKey, attachKey) {
                    var deferred = $.Deferred();
                    this.getAttachment(docKey, attachKey).then(function(blob) {
                        deferred.resolve(URL.createObjectURL(blob))
                    }, function() {
                        deferred.reject()
                    });return deferred.promise()
                },
                ls: function(docKey) {
                    var deferred = $.Deferred();
                    var select;
                    var field;
                    if (!docKey) {
                        select = 'SELECT fname FROM files';
                        field = 'fname'
                    } else {
                        select = 'SELECT akey FROM attachments WHERE fname = ?';
                        field = 'akey'
                    }
                    this._db.transaction(function(tx) {
                        tx.executeSql(select, docKey ? [docKey] : [], function(tx, res) {
                            var listing = [];
                            for (var i = 0; i < res.rows.length; ++i) {
                                listing.push(res.rows.item(i)[field])
                            }
                            deferred.resolve(listing)
                        }, function(err) {
                            deferred.reject(err)
                        })
                    });return deferred.promise()
                },
                clear: function() {
                    var deffered1 = $.Deferred();
                    var deffered2 = $.Deferred();
                    this._db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM files', function() {
                            deffered1.resolve()
                        });tx.executeSql('DELETE FROM attachments', function() {
                            deffered2.resolve()
                        })
                    }, function(err) {
                        deffered1.reject(err);deffered2.reject(err)
                    });return $.when([deffered1, deffered2])
                },
                getAllAttachments: function(fname) {
                    var deferred = $.Deferred();
                    this._db.transaction(function(tx) {
                        tx.executeSql('SELECT value, akey FROM attachments WHERE fname = ?', [fname], function(tx, res) {
                            var result = [];
                            for (var i = 0; i < res.rows.length; ++i) {
                                var item = res.rows.item(i);
                                result.push({
                                    docKey: fname,
                                    attachKey: item.akey,
                                    data: dataURLToBlob(item.value)
                                })
                            }
                            deferred.resolve(result)
                        })
                    }, function(err) {
                        deferred.reject(err)
                    });return deferred.promise()
                },
                getAllAttachmentURLs: function(fname) {
                    var deferred = $.Deferred();
                    this.getAllAttachments(fname).then(function(attachments) {
                        var urls = attachments.map(function(a) {
                            a.url = URL.createObjectURL(a.data);
                            delete a.data;
                            return a
                        });
                        deferred.resolve(urls)
                    }, function(e) {
                        deferred.reject(e)
                    });return deferred.promise()
                },
                revokeAttachmentURL: function(url) {
                    URL.revokeObjectURL(url)
                },
                setAttachment: function(fname, akey, data) {
                    var deferred = $.Deferred();
                    var self = this;
                    convertToBase64(data, function(data) {
                        self._db.transaction(function(tx) {
                            tx.executeSql('INSERT OR REPLACE INTO attachments (fname, akey, value) VALUES(?, ?, ?)', [fname, akey, data])
                        }, function(err) {
                            deferred.reject(err)
                        }, function() {
                            deferred.resolve()
                        })
                    });return deferred.promise()
                },
                rmAttachment: function(fname, akey) {
                    var deferred = $.Deferred();
                    this._db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM attachments WHERE fname = ? AND akey = ?', [fname, akey])
                    }, function(err) {
                        deferred.reject(err)
                    }, function() {
                        deferred.resolve()
                    });return deferred.promise()
                }
            };return {
                init: function(config) {
                    var deferred = $.Deferred();
                    if (!openDb) {
                        deferred.reject("No WebSQL");return deferred.promise()
                    }
                    var db = openDb(config.name, '1.0', 'large local storage', config.size);
                    db.transaction(function(tx) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS files (fname unique, value)');tx.executeSql('CREATE TABLE IF NOT EXISTS attachments (fname, akey, value)');tx.executeSql('CREATE INDEX IF NOT EXISTS fname_index ON attachments (fname)');tx.executeSql('CREATE INDEX IF NOT EXISTS akey_index ON attachments (akey)');tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS uniq_attach ON attachments (fname, akey)')
                    }, function(err) {
                        deferred.reject(err)
                    }, function() {
                        deferred.resolve(new WSQL(db))
                    });return deferred.promise()
                },
                isAvailable: function() {
                    return openDb != null
                }
            }
        })(Q);
        var LargeLocalStorage = (function(Q) {

            var sessionMeta;
            try {
                sessionMeta = localStorage.getItem('LargeLocalStorage-meta');
            } catch ( e ) {}
            if (sessionMeta)
                sessionMeta = JSON.parse(sessionMeta);else
                sessionMeta = {};
            window.addEventListener('beforeunload', function() {
                try {
                    localStorage.setItem('LargeLocalStorage-meta', JSON.stringify(sessionMeta))
                } catch ( e ) {}
            });
            function defaults(options, defaultOptions) {
                for (var k in defaultOptions) {
                    if (options[k] === undefined)
                        options[k] = defaultOptions[k]
                }
                return options
            }
            ;
            var providers = {
                FileSystemAPI: FilesystemAPIProvider,
                IndexedDB: IndexedDBProvider,
                WebSQL: WebSQLProvider
            };
            var defaultConfig = {
                size: 10 * 1024 * 1024,
                name: 'lls'
            };
            function selectImplementation(config) {
                if (!config)
                    config = {};
                config = defaults(config, defaultConfig);
                if (config.forceProvider) {
                    return providers[config.forceProvider].init(config)
                }
                return FilesystemAPIProvider.init(config).then(function(impl) {
                    return Q(impl)
                }, function() {
                    return IndexedDBProvider.init(config)
                }).then(function(impl) {
                    return Q(impl)
                }, function() {
                    return WebSQLProvider.init(config)
                }).then(function(impl) {
                    return Q(impl)
                }, function() {
                    console.error('Unable to create any storage implementations.  Using LocalStorage');return LocalStorageProvider.init(config)
                })
            }
            ;
            function copy(obj) {
                var result = {};
                Object.keys(obj).forEach(function(key) {
                    result[key] = obj[key]
                });return result
            }
            ;
            function handleDataMigration(storageInstance, config, previousProviderType, currentProivderType) {
                var previousProviderType = sessionMeta[config.name] && sessionMeta[config.name].lastStorageImpl;
                if (config.migrate) {
                    if (previousProviderType != currentProivderType && previousProviderType in providers) {
                        config = copy(config);
                        config.forceProvider = previousProviderType;selectImplementation(config).then(function(prevImpl) {
                            config.migrate(null, prevImpl, storageInstance, config)
                        }, function(e) {
                            config.migrate(e)
                        })
                    } else {
                        if (config.migrationComplete) config.migrationComplete()
                    }
                }
            }
            ;
            function LargeLocalStorage(config) {
                var deferred = $.Deferred();
                this.initialized = deferred.promise();var piped = createPipeline(['ready', 'ls', 'rm', 'clear', 'getContents', 'setContents', 'getAttachment', 'setAttachment', 'getAttachmentURL', 'getAllAttachments', 'getAllAttachmentURLs', 'revokeAttachmentURL', 'rmAttachment', 'getCapacity', 'initialized']);
                piped.pipe.addLast('lls', this);
                piped.initialized = this.initialized;var self = this;
                selectImplementation(config).then(function(impl) {
                    self._impl = impl;handleDataMigration(piped, config, self._impl.type);
                    sessionMeta[config.name] = sessionMeta[config.name] || {};
                    sessionMeta[config.name].lastStorageImpl = impl.type;deferred.resolve(piped)
                }).fail(function(e) {
                    console.log(e);deferred.reject('No storage provider found')
                });return piped
            }
            ;LargeLocalStorage.prototype = {
                ready: function() {
                    return this._impl != null
                },
                ls: function(docKey) {
                    this._checkAvailability();return this._impl.ls(docKey)
                },
                rm: function(docKey) {
                    this._checkAvailability();return this._impl.rm(docKey)
                },
                clear: function() {
                    this._checkAvailability();return this._impl.clear()
                },
                getContents: function(docKey, options) {
                    this._checkAvailability();return this._impl.getContents(docKey, options)
                },
                setContents: function(docKey, data, options) {
                    this._checkAvailability();return this._impl.setContents(docKey, data, options)
                },
                getAttachment: function(docKey, attachKey) {
                    if (!docKey)
                        docKey = '__emptydoc__';
                    this._checkAvailability();return this._impl.getAttachment(docKey, attachKey)
                },
                setAttachment: function(docKey, attachKey, data) {
                    if (!docKey)
                        docKey = '__emptydoc__';
                    this._checkAvailability();return this._impl.setAttachment(docKey, attachKey, data)
                },
                getAttachmentURL: function(docKey, attachKey) {
                    if (!docKey)
                        docKey = '__emptydoc__';
                    this._checkAvailability();return this._impl.getAttachmentURL(docKey, attachKey)
                },
                getAllAttachments: function(docKey) {
                    if (!docKey)
                        docKey = '__emptydoc__';
                    this._checkAvailability();return this._impl.getAllAttachments(docKey)
                },
                getAllAttachmentURLs: function(docKey) {
                    if (!docKey)
                        docKey = '__emptydoc__';
                    this._checkAvailability();return this._impl.getAllAttachmentURLs(docKey)
                },
                revokeAttachmentURL: function(url) {
                    this._checkAvailability();return this._impl.revokeAttachmentURL(url)
                },
                rmAttachment: function(docKey, attachKey) {
                    if (!docKey)
                        docKey = '__emptydoc__';
                    this._checkAvailability();return this._impl.rmAttachment(docKey, attachKey)
                },
                getCapacity: function() {
                    this._checkAvailability();
                    if (this._impl.getCapacity) return this._impl.getCapacity();else return -1
                },
                _checkAvailability: function() {
                    if (!this._impl) {
                        throw {
                            msg: "No storage implementation is available yet.  The user most likely has not granted you app access to FileSystemAPI or IndexedDB",
                            code: "NO_IMPLEMENTATION"
                        }
                    }
                }
            };
            LargeLocalStorage.contrib = {};
            function writeAttachments(docKey, attachments, storage) {
                var promises = [];
                attachments.forEach(function(attachment) {
                    promises.push(storage.setAttachment(docKey, attachment.attachKey, attachment.data))
                });return $.when(promises)
            }
            ;
            function copyDocs(docKeys, oldStorage, newStorage) {
                var promises = [];
                docKeys.forEach(function(key) {
                    promises.push(oldStorage.getContents(key).then(function(contents) {
                        return newStorage.setContents(key, contents)
                    }))
                });docKeys.forEach(function(key) {
                    promises.push(oldStorage.getAllAttachments(key).then(function(attachments) {
                        return writeAttachments(key, attachments, newStorage)
                    }))
                });return $.when(promises)
            }
            ;LargeLocalStorage.copyOldData = function(err, oldStorage, newStorage, config) {
                if (err) {
                    throw err;
                }
                oldStorage.ls().then(function(docKeys) {
                    return copyDocs(docKeys, oldStorage, newStorage)
                }).then(function() {
                    if (config.migrationComplete) config.migrationComplete()
                }, function(e) {
                    config.migrationComplete(e)
                })
            };
            LargeLocalStorage._sessionMeta = sessionMeta;
            var availableProviders = [];
            Object.keys(providers).forEach(function(potentialProvider) {
                if (providers[potentialProvider].isAvailable()) availableProviders.push(potentialProvider)
            });
            LargeLocalStorage.availableProviders = availableProviders;return LargeLocalStorage
        })(Q);
        return LargeLocalStorage
    }
    ;window.LargeLocalStorage = definition.call({}, Q)
}).call(this, this);