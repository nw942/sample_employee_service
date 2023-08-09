import { Router } from 'express';

import { Controller } from './controllers/EmployeeController';
import { Service } from './service/EmployeeService';
import { Validator } from './validator/EmployeeValidator';
import { EmployeeMongoDB } from './dao/mongo/EmployeeMongo';
import { EmployeeTransformer } from './transformer/EmployeeTransformer';
import { EmployeeDB } from './dao/EmployeeDB';

export const router = Router();

const transformer = new EmployeeTransformer();
const dao:EmployeeDB = new EmployeeMongoDB()
const service = new Service(dao, transformer);
const validator = new Validator();
const controller = new Controller(service, validator);

router.get('/v1/employees', controller.getEmployees);
router.get('/v1/employees/:id', controller.getEmployee);
router.post('/v1/employees', controller.saveEmployee);
router.put('/v1/employees/:id', controller.updateEmployee);
router.delete('/v1/employees/:id', controller.deleteEmployee);
