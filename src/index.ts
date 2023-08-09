
import express from "express";
import bodyParser from 'body-parser';
import { router } from './routes';
import { Logger } from "./libraries/logging/logger";
import { AuthenticationInterceptor } from "./middleware/AuthenticationInterceptor";
import { MongoDBConnection } from "./dao/mongo/MongoDBService";
import cors from "cors";


// Read environment variables from .env
require('dotenv').config();

const log = Logger.getLogger("my-app-backend");

const app = express();


// Status Monitor
//app.use(require('express-status-monitor')());


// CORS
const CORS_ACCESS_CONTROL_ALLOW_ORIGIN:string = process.env.CORS_ACCESS_CONTROL_ALLOW_ORIGIN ? process.env.CORS_ACCESS_CONTROL_ALLOW_ORIGIN : "http://localhost";

const corsOptions = {
        origin: CORS_ACCESS_CONTROL_ALLOW_ORIGIN,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        //allowMethods, allowedHeaders, exposedHeaders, maxAge
    }
app.use(cors(corsOptions))


// Middleware
const authenticationInterceptor = new AuthenticationInterceptor();
app.use(authenticationInterceptor.authenticateRequest);

app.use(bodyParser.json());
app.use(express.urlencoded());


// Initialise database and endpoints

if (!process.env.DB_URL || !process.env.DB_NAME) {
    log.info("Database connection details not provided.");
    process.exit();
}

log.info("Connecting to database...")
MongoDBConnection.connectToDatabase(process.env.DB_URL, process.env.DB_NAME)
    .then( () => { log.info("Connected to database") } )
    .then( () => {

        app.use('/', router);

        const LISTENING_PORT:string = process.env.LISTENING_PORT ? process.env.LISTENING_PORT : "3000";
        
        app.listen(LISTENING_PORT, function () {
              log.info("Listening on port " + LISTENING_PORT);
            });
    } )
    .catch(e => {
        log.error("Initialisation error ", e);
        process.exit();
        });
