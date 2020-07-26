"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testkit = void 0;
const noniClient = require("@quenk/noni-mongodb/lib/client");
const noniDb = require("@quenk/noni-mongodb/lib/database");
const noniCollection = require("@quenk/noni-mongodb/lib/database/collection");
const record_1 = require("@quenk/noni/lib/data/record");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const defaultConfig = {
    url: 'mongodb://localhost/testkittest',
    collectionNames: [],
    removeAllCollections: false,
    dropDatabase: false
};
/**
 * Testkit provides an API for manipulating a MongoDB database during testing.
 */
class Testkit {
    constructor(__config = {}) {
        this.__config = __config;
        this.config = record_1.merge(defaultConfig, this.__config);
        this.client = undefined;
        this.db = undefined;
        /**
         * setUp initializes the client and connects to the database.
         */
        this.setUp = () => {
            let that = this;
            return future_1.doFuture(function* () {
                let { url } = that.config;
                that.client = yield noniClient.connect(url ?
                    url : process.env.MONGO_URL);
                that.db = that.client.db();
                return future_1.pure(undefined);
            });
        };
        /**
         * tearDown should be ran after each test so that the desired collections can
         * be removed after each test.
         */
        this.tearDown = () => {
            let that = this;
            return future_1.doFuture(function* () {
                let { db, config } = that;
                let { removeAllCollections, collectionNames } = config;
                let names = (removeAllCollections === true) ?
                    (yield noniDb.collections(db))
                        .map((c) => c.collectionName) :
                    collectionNames;
                yield future_1.sequential(names.map((c) => noniDb.dropCollection(that.db, c)));
                return future_1.pure(undefined);
            });
        };
        /*
         * setDown should be ran at the end of the entire suite to drop the database
         * and terminate the connection.
         */
        this.setDown = () => {
            let that = this;
            return future_1.doFuture(function* () {
                if (that.config.dropDatabase)
                    yield noniDb.drop(that.db);
                let client = that.client;
                that.client = undefined;
                that.db = undefined;
                return noniClient.disconnect(client);
            });
        };
        /**
         * removeCollection by name.
         */
        this.removeCollection = (name) => noniDb.dropCollection(this.db, name);
        /**
         * populate a collection with the provided data.
         */
        this.populate = (collection, data) => noniCollection.insertMany(this.db.collection(collection), data);
        /**
         * find documents in a collection that match the provided query object.
         */
        this.find = (collection, qry, opts) => noniCollection.find(this.db.collection(collection), qry, opts);
        /**
         * findOne document in a collection that matches the provided query object.
         */
        this.findOne = (collection, qry, opts) => noniCollection.findOne(this.db.collection(collection), qry, opts);
        /**
         * update documents in a collection that match the provided query object.
         */
        this.update = (collection, qry, spec) => noniCollection.updateMany(this.db.collection(collection), qry, spec);
        /**
         * count the number of documetns occuring in a collection.
         */
        this.count = (collection, qry) => noniCollection.count(this.db.collection(collection), qry);
    }
}
exports.Testkit = Testkit;
//# sourceMappingURL=index.js.map