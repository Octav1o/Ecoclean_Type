import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { users?: mongoDB.Collection, alerts?: mongoDB.Collection, containers?: mongoDB.Collection, subscriptions?: mongoDB.Collection} = {}

export async function connectToDatabase() {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
        process.env.DB_CONN_STRING ?? ""
    );

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const userCollection: mongoDB.Collection = db.collection(
        process.env.USER_COLLECTION_NAME?? ""
    );
    const alertCollection: mongoDB.Collection = db.collection(
        process.env.ALERT_COLLECTION_NAME?? ""
    );
    const conteinerCollection: mongoDB.Collection = db.collection(
        process.env.CONTAINER_COLLECTION_NAME?? ""
    );
    const subscriptionCollection: mongoDB.Collection = db.collection(
        process.env.SUBSCRIPTIONS_COLLECTION_NAME ?? ""
    );

    collections.users = userCollection;
    collections.alerts = alertCollection;
    collections.containers = conteinerCollection;
    collections.subscriptions = subscriptionCollection;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collections: ${userCollection.collectionName}, ${alertCollection.collectionName}`
    );
}
