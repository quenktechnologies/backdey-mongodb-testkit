import * as mongo from 'mongodb';
import * as noniCollection from '@quenk/noni-mongodb/lib/database/collection';
import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Configuration for Testkit instances.
 */
export interface Configuration {
    /**
     * url to use to connect the client.
     *
     * The environment variable MONGO_URL is used if this is not specified.
     */
    url: string;
    /**
     * collectionNames is an array of collection names that can be configured to
     * automically remove after each test.
     */
    collectionNames: string;
    /**
     * removeAlLCollections if true, removes all collections after each test
     * instead of the ones in collectionNames.
     */
    removeAllCollections: boolean;
    /**
     * dropDatabase if true, will drop the database at the end of testing.
     */
    dropDatabase: boolean;
}
/**
 * Testkit provides an API for manipulating a MongoDB database during testing.
 */
export declare class Testkit {
    __config: Partial<Configuration>;
    constructor(__config: Partial<Configuration>);
    config: Configuration;
    client: mongo.MongoClient;
    db: mongo.Db;
    /**
     * setUp initializes the client and connects to the database.
     */
    setUp: () => Future<void>;
    /**
     * tearDown should be ran after each test so that the desired collections can
     * be removed after each test.
     */
    tearDown: () => Future<void>;
    setDown: () => Future<void>;
    /**
     * removeCollection by name.
     */
    removeCollection: (name: string) => Future<boolean>;
    /**
     * populate a collection with the provided data.
     */
    populate: (collection: string, data: object[]) => Future<noniCollection.InsertResult>;
    /**
     * find documents in a collection that match the provided query object.
     */
    find: (collection: string, qry: object) => Future<unknown[]>;
    /**
     * findOne document in a collection that matches the provided query object.
     */
    findOne: (collection: string, qry: object) => Future<noniCollection.Maybe<unknown>>;
    /**
     * update documents in a collection that match the provided query object.
     */
    update: (collection: string, qry: object, spec: object) => Future<mongo.UpdateWriteOpResult>;
    /**
     * count the number of documetns occuring in a collection.
     */
    count: (collection: string, qry: object) => Future<number>;
}
