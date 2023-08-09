# my-app-backend
Example backend service that works with My-App-Frontend Next.js React application

## Building and Running
 - npm install` to install all dependencies.
 - `npm run compile` to compile the typescript.
 - `npm start` to run the service.
 - `npm run all` to compile the typescript and run the service.
 - `npm run test` to run a suite of tests against a server.
 - `npm publish` to build and publish to the npm registry.

## Configuration

The following environment variables can be set to enable running in a containerised environment:

 - LISTENING_PORT - default to 3000
 - DB_URL - Mongo DB connection URL e.g. mongodb+srv://YYYY:XXXXXXX@cluster0.ZZZZZ.mongodb.net/?retryWrites=true&w=majority
 - DB_NAME - Mongo DB database name
 - CORS_ACCESS_CONTROL_ALLOW_ORIGIN - defaults to http://localhost
 - OPTIMISTIC_LOCKING - default is NOT set i.e. optimistic locking is disabled

## Testing the API

If OPTIMISTIC_LOCKING is set please pass the if-Match header - by default it is not set

### Creating a new employee
```
curl -X POST http://localhost:3000/v1/employees -H 'Content-Type: application/json' -d '{"firstName": "first-name", "otherNames": "other-names", "lastName": "last-name"}'
```

### Retrieving all employees
```
curl http://localhost:3000/v1/employees
```

### Retrieving one employee
Replace `id` with the ID of the employee.

```
curl http://localhost:3000/v1/employees/id
```

### Updating an existing employee
Replace `id` with the ID of the employee.

```
curl -X PUT http://localhost:3000v1/employees/id -H 'Content-Type: application/json' -d '{"firstName": "updated-first-name", "otherNames": "updated-other-names",  "lastName": "updated-last-name"}'
```

### Deleting a employee
Replace `id` with the ID of the employee.

```
curl -X DELETE http://localhost:8081/v1/employees/id
```
