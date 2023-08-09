
import { Request, Response } from 'express';
import { Service } from '../service/EmployeeService';
import { Validator } from '../validator/EmployeeValidator';
import { Logger } from '../libraries/logging/logger';
import etag from 'etag';


const log = Logger.getLogger("controllers.EmployeeController");

export class Controller {

  private service: Service;
  private validator: Validator;


  constructor(service: Service, validator: Validator) {
    this.service = service;
    this.validator = validator;
  }

  public getEmployees = async (request: Request, response: Response) => {
    try {
      const employees = await this.service.getEmployees();
      if (!employees || employees.length == 0) {
        log.info("No employees found");
        response.sendStatus(404);
      } else {
        log.info("Employees found");
        response.send(employees);
      }
    } catch(err) {
      log.error(err);
      response.sendStatus(500);
    }
  };

  public getEmployee = async (request: Request, response: Response) => {
    const id = request.params.id;
    log.info("Finding employee with ID: " + id);

    const errors:string[] = this.validator.validateId(id);
    if(errors && errors.length > 0) {
      return response.status(400).send(errors);
    }

    try {
      const employee = await this.service.getEmployee(id);
      if (employee == null) {
        log.info("No employees found");
        response.sendStatus(404);
      } else {
        log.info("Employee found");
        response.send(employee);
      }
    } catch(err) {
      log.error(err);
      response.sendStatus(500);
    }
  };

  public saveEmployee = async (request: Request, response: Response) => {
    const data = request.body;

    const errors = this.validator.validateEmployee(data);
    if(errors && errors.length > 0) {
      return response.status(400).send(errors);
    }

    try {
        const employee = await this.service.saveEmployee(data);
        log.info("Employee saved successfully");
        response.status(201).send(employee);
        } catch (err) {
        log.error(err);
        response.sendStatus(500);
    }
  };

  public updateEmployee = async (request: Request, response: Response) => {
    const id = request.params.id;
    const data = request.body;

    const ifMatch:string = request.headers['if-match'] as string

    if ((ifMatch.length === 0) && process.env.OPTIMISTIC_LOCKING) {
        return response.status(412).send();
    }

    let errors = this.validator.validateId(id);
    if(errors && errors.length > 0) {
      return response.status(400).send(errors);
    }

    errors = this.validator.validateEmployee(data);
    if(errors && errors.length > 0) {
      return response.status(400).send(errors);
    }

    try {
        log.info("Finding employee with ID: " + id);

        const employee = await this.service.updateEmployee(id, data);
        log.info("Employee updated successfully");
        response.status(200).send(employee);
    } catch(err) {
            log.error(err);
            response.sendStatus(500);
    }
  };

  public deleteEmployee = async (request: Request, response: Response) => {
    const id = request.params.id;

    const errors = this.validator.validateId(id);
    if(errors && errors.length > 0) {
      return response.status(400).send(errors);
    }

    try {
      await this.service.deleteEmployee(id);
      log.info("Employee deleted successfully: " + id);
      response.sendStatus(200);
    } catch(err) {
      log.error(err);
      response.sendStatus(500);
    }
  };
}
