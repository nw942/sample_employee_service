
import Employee from '../../model/Employee';
import { EmployeeEntity } from '../EmployeeEntity';
import { Logger } from '../../libraries/logging/logger';
import { EmployeeDB } from '../EmployeeDB';
import { MongoDBConnection } from './MongoDBService';
import { ObjectId } from 'mongodb';
import * as mongoDB from "mongodb";


const log = Logger.getLogger("dao.EmployeeMongo");

export class EmployeeMongoDB implements EmployeeDB {

  private employeesCollection: mongoDB.Collection

  private getEmployeeCollection() : mongoDB.Collection {

    if (!this.employeesCollection) {
        this.employeesCollection = MongoDBConnection.db.collection("Employee");
    }

    return this.employeesCollection;
  }

  public async getEmployees(): Promise<EmployeeEntity[]> {
    log.info('Retrieving employees from DB');
    const result = (await this.getEmployeeCollection().find({}).toArray()) as unknown as EmployeeEntity[];

    return result;
  }

  public async getEmployee(id: string): Promise<EmployeeEntity> {
    log.info('Retrieving employee from DB: ' + id);

    const query = { _id: new ObjectId(id) };
    const result = (await this.getEmployeeCollection().findOne(query)) as unknown as EmployeeEntity;

    if(result) {
      return result;
    }
    return null as unknown as EmployeeEntity;
  }

  public async insertEmployee(employeeEntity: EmployeeEntity): Promise<EmployeeEntity> {
    log.info("Saving employee: " + JSON.stringify(employeeEntity));

    /*
    const entity = new EmployeeEntity()
    entity.firstName = employee.firstName
    entity.lastName = employee.lastName
    entity.otherNames = ""
    */

    log.info("Inserting employee: " + JSON.stringify(employeeEntity));
    const result = await this.getEmployeeCollection().insertOne(employeeEntity);
    log.info("Employee saved successfully: " + JSON.stringify(result));

    employeeEntity._id = result.insertedId

    return employeeEntity;
  }

  public async updateEmployee(id: string, employeeEntity: EmployeeEntity): Promise<EmployeeEntity> {

    // Do not pass _id to Mongo DB on an update
    delete employeeEntity._id

    log.info("Updating employee [" + id + "]: " + JSON.stringify(employeeEntity));

    const query = { _id: new ObjectId(id) };
  
    const result = await this.getEmployeeCollection().updateOne(query, { $set: employeeEntity });
    log.info("Successfully updated employee [" + id + "]: " + JSON.stringify(result));

    return employeeEntity;
  }

  public async deleteEmployee(id: string): Promise<void> {
    log.info("Deleting employee [" + id + "]");

    const query = { _id: new ObjectId(id) };
    await this.getEmployeeCollection().deleteOne(query);

    log.info("Deleted employee [" + id + "]");
  }
}
