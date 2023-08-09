
import {Request, Response, NextFunction } from "express";
import { Logger } from '../libraries/logging/logger';


const log = Logger.getLogger("middleware.authentication");

export class AuthenticationInterceptor {

    public authenticateRequest(request:Request, response:Response, next:NextFunction) {
        
        log.trace("Incoming request received\n"
            + " - Path: " + request.path + "\n"
            + " - Method: " + request.method + "\n");

        // Verify JWT token...

        response.on('finish', function() {
            log.trace("Request processsing completed\n"
                + " - URI: " + request.originalUrl + "\n"
                + " - Status code: " + response.statusCode + "\n");
        });

        next();
    }
}
