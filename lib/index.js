"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testkit = void 0;
var noniClient = require("@quenk/noni-mongodb/lib/client");
var noniDb = require("@quenk/noni-mongodb/lib/database");
var noniCollection = require("@quenk/noni-mongodb/lib/database/collection");
var record_1 = require("@quenk/noni/lib/data/record");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var defaultConfig = {
    url: 'mongodb://localhost/testkittest',
    collectionNames: [],
    removeAllCollections: false,
    dropDatabase: false
};
/**
 * Testkit provides an API for manipulating a MongoDB database during testing.
 */
var Testkit = /** @class */ (function () {
    function Testkit(__config) {
        var _this = this;
        if (__config === void 0) { __config = {}; }
        this.__config = __config;
        this.config = record_1.merge(defaultConfig, this.__config);
        this.client = undefined;
        this.db = undefined;
        /**
         * setUp initializes the client and connects to the database.
         */
        this.setUp = function () {
            var that = _this;
            return future_1.doFuture(function () {
                var url, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            url = that.config.url;
                            _a = that;
                            return [4 /*yield*/, noniClient.connect(url ?
                                    url : process.env.MONGO_URL)];
                        case 1:
                            _a.client = _b.sent();
                            that.db = that.client.db();
                            return [2 /*return*/, future_1.pure(undefined)];
                    }
                });
            });
        };
        /**
         * tearDown should be ran after each test so that the desired collections can
         * be removed after each test.
         */
        this.tearDown = function () {
            var that = _this;
            return future_1.doFuture(function () {
                var db, config, removeAllCollections, collectionNames, names, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            db = that.db, config = that.config;
                            removeAllCollections = config.removeAllCollections, collectionNames = config.collectionNames;
                            if (!(removeAllCollections === true)) return [3 /*break*/, 2];
                            return [4 /*yield*/, noniDb.collections(db)];
                        case 1:
                            _a = (_b.sent())
                                .map(function (c) { return c.collectionName; });
                            return [3 /*break*/, 3];
                        case 2:
                            _a = collectionNames;
                            _b.label = 3;
                        case 3:
                            names = _a;
                            return [4 /*yield*/, future_1.sequential(names.map(function (c) {
                                    return noniDb.dropCollection(that.db, c);
                                }))];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, future_1.pure(undefined)];
                    }
                });
            });
        };
        /*
         * setDown should be ran at the end of the entire suite to drop the database
         * and terminate the connection.
         */
        this.setDown = function () {
            var that = _this;
            return future_1.doFuture(function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!that.config.dropDatabase) return [3 /*break*/, 2];
                            return [4 /*yield*/, noniDb.drop(that.db)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            client = that.client;
                            that.client = undefined;
                            that.db = undefined;
                            return [2 /*return*/, noniClient.disconnect(client)];
                    }
                });
            });
        };
        /**
         * removeCollection by name.
         */
        this.removeCollection = function (name) { return noniDb.dropCollection(_this.db, name); };
        /**
         * populate a collection with the provided data.
         */
        this.populate = function (collection, data) {
            return noniCollection.insertMany(_this.db.collection(collection), data);
        };
        /**
         * find documents in a collection that match the provided query object.
         */
        this.find = function (collection, qry) {
            return noniCollection.find(_this.db.collection(collection), qry);
        };
        /**
         * findOne document in a collection that matches the provided query object.
         */
        this.findOne = function (collection, qry) {
            return noniCollection.findOne(_this.db.collection(collection), qry);
        };
        /**
         * update documents in a collection that match the provided query object.
         */
        this.update = function (collection, qry, spec) {
            return noniCollection.updateMany(_this.db.collection(collection), qry, spec);
        };
        /**
         * count the number of documetns occuring in a collection.
         */
        this.count = function (collection, qry) {
            return noniCollection.count(_this.db.collection(collection), qry);
        };
    }
    return Testkit;
}());
exports.Testkit = Testkit;
//# sourceMappingURL=index.js.map