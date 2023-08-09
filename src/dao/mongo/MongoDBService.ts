
import * as mongoDB from "mongodb";
import { Logger } from '../../libraries/logging/logger';


const log = Logger.getLogger("dao.MongoDBConnection");

export class MongoDBConnection {

    public static db: mongoDB.Db;

    public static async connectToDatabase (url:string, database:string) {
 
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(url);
                
        await client.connect();
        
        MongoDBConnection.db = client.db(database);

        log.info(`Successfully connected to database: ${MongoDBConnection.db.databaseName}`);

        // Mongo DB Schema Validation
        // TODO: Move to individual DAOs.
        await MongoDBConnection.db.command({
            "collMod": "Employee",
            "validator": {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["firstName", "otherNames", "lastName"],
                    additionalProperties: false,
                    properties: {
                    _id: { bsonType: "objectId" },
                    firstName: {
                        bsonType: "string",
                        description: "'firstName' is required and is a string"
                    },
                    otherNames: {
                        bsonType: "string",
                        description: "'otherNames' is required and is a string"
                    },
                    lastName: {
                        bsonType: "string",
                        description: "'lastName' is required and is a string"
                    }
                    }
                }
             }
        });

        log.info(`Successfully configured Mongo DB Scheme Validation`);
     }   
}
