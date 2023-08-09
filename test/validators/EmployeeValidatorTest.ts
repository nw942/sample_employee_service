
import {assert} from 'chai';

import Employee from '../../src/model/Employee';
import { Validator } from '../../src/validator/EmployeeValidator';

const missingIdError = "ID must be supplied";
const emptyIdError = "A value must be supplied for the ID";
const mandatoryFirstNameError = "First name must not be empty";
const mandatoryLastNameError = "Last name must not be empty";

let validator: Validator;

describe('Validator unit tests', () => {

    beforeEach(done => {
        validator = new Validator();
        done();
    });

    it('ID is missing', async () => {
        const errors = validator.validateId(null as unknown as string);
        assert.deepEqual(errors, [missingIdError]);
    });

    it('ID is empty', async () => {
        const errors = validator.validateId("");
        assert.deepEqual(errors, [emptyIdError]);
    });

    it('ID is valid', async () => {
        const errors = validator.validateId("1");
        assert.deepEqual(errors, []);
    });

    it('First name is missing', async () => {
        const employee = new Employee();
        employee.lastName = "lastName";

        const errors = validator.validateEmployee(employee)
        assert.deepEqual(errors, [mandatoryFirstNameError]);
    });

    it('First name is empty', async () => {
        const employee = new Employee();
        employee.firstName = "";
        employee.lastName = "lastName";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, [mandatoryFirstNameError]);
    });

    it('Last name is missing', async () => {
        const employee = new Employee();
        employee.firstName = "firstName";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, [mandatoryLastNameError]);
    });

    it('Last name is empty', async () => {
        const employee = new Employee();
        employee.firstName = "firstName";
        employee.lastName = "";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, [mandatoryLastNameError]);
    });

    it('Both names are missing', async () => {
        const errors = validator.validateEmployee(new Employee());
        assert.deepEqual(errors, [mandatoryFirstNameError, mandatoryLastNameError]);
    });

    it('Both names are empty', async () => {
        const employee = new Employee();
        employee.firstName = "";
        employee.lastName = "";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, [mandatoryFirstNameError, mandatoryLastNameError])
    });

    it('First name is empty and last name is missing', async () => {
        const employee = new Employee();
        employee.firstName = "";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, [mandatoryFirstNameError, mandatoryLastNameError]);
    });

    it('First name is missing and last name is empty', async () => {
        const employee = new Employee();
        employee.lastName = "";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, [mandatoryFirstNameError, mandatoryLastNameError]);
    });

    it('Data is valid', async () => {
        const employee = new Employee();
        employee.firstName = "firstName";
        employee.lastName = "lastName";

        const errors = validator.validateEmployee(employee);
        assert.deepEqual(errors, []);
    });
});