import { Request, Response } from 'express';
import sinon from 'sinon';
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';

import { Controller } from '../../src/controllers/EmployeeController';
import { Service } from '../../src/service/EmployeeService';
import { Validator } from '../../src/validator/EmployeeValidator';
import { EmployeeMongoDB } from '../../src/dao/mongo/EmployeeMongo';
import { EmployeeTransformer } from '../../src/transformer/EmployeeTransformer';


chai.use(sinonChai);

const id = "1";
const firstName = "first name";
const lastName = "last name";
const employee = {firstName: "firstName", lastName: "lastName"};
const employees = [employee];

const missingIdError = "Missing ID";
const emptyIdError = "Empty ID";
const mandatoryFirstNameError = "Mandatory first name";
const mandatoryLastNameError = "Mandatory last name";

var controller: Controller;
var service: Service;
var validator: Validator;

describe('Controller layer unit tests', () => {

    beforeEach(done => {
        service = new Service(new EmployeeMongoDB(), new EmployeeTransformer());
        validator = new Validator();
        controller = new Controller(service, validator);

        sinon.reset();
        sinon.restore();
        done();
    });

    afterEach(done => {
        sinon.reset();
        sinon.restore();
        done();
    });

    it('Should get all employees', async () => {
        const stub = sinon.stub(service, 'getEmployees').returns(employees);
        const mockRequest = {} as Request;
        const mockResponse = {send: sinon.spy()} as Response;

        await controller.getEmployees(mockRequest, mockResponse);

        expect(stub).to.have.been.calledOnceWith();
        expect(mockResponse.send).to.have.been.calledWith(employees);
    });

    it('Should return status 404 when no employees found', async () => {
        const stub = sinon.stub(service, 'getEmployees').returns(null);
        const mockRequest = {} as Request;
        const mockResponse = {sendStatus: sinon.spy()} as Response;

        await controller.getEmployees(mockRequest, mockResponse);

        expect(stub).to.have.been.calledOnceWith();
        expect(mockResponse.sendStatus).to.have.been.calledWith(404);
    });

    it('Should return status 404 when empty list of employees returned', async () => {
        const stub = sinon.stub(service, 'getEmployees').returns([]);
        const mockRequest = {} as Request;
        const mockResponse = {sendStatus: sinon.spy()} as Response;

        await controller.getEmployees(mockRequest, mockResponse);

        expect(stub).to.have.been.calledOnceWith();
        expect(mockResponse.sendStatus).to.have.been.calledWith(404);
    });

    it('Should throw error when getting employees', async () => {
        const stub = sinon.stub(service, 'getEmployees').throws(new Error("Error"));
        const mockRequest = {} as Request;
        const mockResponse = {sendStatus: sinon.spy()} as Response;

        await controller.getEmployees(mockRequest, mockResponse);

        expect(stub).to.have.been.calledOnceWith();
        expect(mockResponse.sendStatus).to.have.been.calledWith(500);
    });

    it('Should return a bad request for getting employee with missing ID', async () => {
        sinon.stub(validator, 'validateId').returns([missingIdError]);

        const invalidRequest = {params: {}} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.getEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([missingIdError]);
    });

    it('Should return a bad request for getting employee with empty ID', async () => {
        sinon.stub(validator, 'validateId').returns([emptyIdError]);

        const invalidRequest = {} as Request;
        invalidRequest['params'] = {id: ""};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.getEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([emptyIdError]);
    });

    it('Should return a employee', async () => {
        sinon.stub(validator, 'validateId').returns([]);

        const mockRequest = {} as Request;
        mockRequest['params'] = {id: id};


        const mockResponse = {send: sinon.spy()} as Response;
        const serviceStub = sinon.stub(service, 'getEmployee').returns(employee);

        await controller.getEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id);
        expect(mockResponse.send).to.have.been.calledWith(employee);
    });

    it('Employee not found', async () => {
        sinon.stub(validator, 'validateId').returns([]);

        const mockRequest = {} as Request;
        mockRequest['params'] = {id: id};

        const mockResponse = {sendStatus: sinon.stub()} as Response;
        const serviceStub = sinon.stub(service, 'getEmployee').returns(null);

        await controller.getEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id);
        expect(mockResponse.sendStatus).to.have.been.calledWith(404);
    });

    it('Error when getting employee', async () => {
        sinon.stub(validator, 'validateId').returns([]);

        const mockRequest = {} as Request;
        mockRequest['params'] = {id: id};

        const mockResponse = {sendStatus: sinon.stub()} as Response;
        const serviceStub = sinon.stub(service, 'getEmployee').throws(new Error("Error"));

        await controller.getEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id);
        expect(mockResponse.sendStatus).to.have.been.calledWith(500);
    });

    it('Validation error when saving employee with missing first name and last name', async () => {
        sinon.stub(validator, 'validateEmployee').returns([mandatoryFirstNameError, mandatoryLastNameError]);

        const invalidRequest = {body: {}} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.saveEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([mandatoryFirstNameError, mandatoryLastNameError]);
    });

    it('Validation error when saving employee with missing first name', async () => {
        sinon.stub(validator, 'validateEmployee').returns([mandatoryFirstNameError]);

        const invalidRequest = {body: {lastName: lastName}} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.saveEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([mandatoryFirstNameError]);
    });

    it('Validation error when saving employee with missing last name', async () => {
        sinon.stub(validator, 'validateEmployee').returns([mandatoryLastNameError]);

        const invalidRequest = {body: {firstName: firstName}} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.saveEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([mandatoryLastNameError]);
    });

    it('Employee saved successfully', async () => {
        sinon.stub(validator, 'validateId').returns([]);
    
        const mockRequest = {body: employee} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        const serviceStub = sinon.stub(service, 'saveEmployee').returns(employee);

        await controller.saveEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(employee);
        expect(mockResponse.status).to.have.been.calledWith(201);
        expect(mockResponse.send).to.have.been.calledWith(employee);
    });

    it('Error when saving employee', async () => {
        sinon.stub(validator, 'validateId').returns([]);

        const mockRequest = {body: employee} as Request;
        const mockResponse = {sendStatus: sinon.stub()} as Response;
        const serviceStub = sinon.stub(service, 'saveEmployee').throws(new Error("Error"));

        await controller.saveEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(employee);
        expect(mockResponse.sendStatus).to.have.been.calledWith(500);
    });

    it('Should return a bad request for updating employee with missing ID', async () => {
        sinon.stub(validator, 'validateId').returns([missingIdError]);

        const invalidRequest = {params: {}, body: employee, headers: {"if-match":"hash"}} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.updateEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([missingIdError]);
    });

    it('Should return a bad request for updating employee with empty ID', async () => {
        sinon.stub(validator, 'validateId').returns([emptyIdError]);

        const invalidRequest = {body: employee, headers: {"if-match":"hash"}} as Request;
        invalidRequest['params'] = {id: ""};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.updateEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([emptyIdError]);
    });

    it('Validation error when updating employee with missing first name and last name', async () => {
        sinon.stub(validator, 'validateId').returns([]);
        sinon.stub(validator, 'validateEmployee').returns([mandatoryFirstNameError, mandatoryLastNameError]);

        const mockRequest = {body: {}, headers: {"if-match":"hash"}} as Request;
        mockRequest['params'] = {id: id};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.updateEmployee(mockRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([mandatoryFirstNameError, mandatoryLastNameError]);
    });

    it('Validation error when updating employee with missing first name', async () => {
        sinon.stub(validator, 'validateId').returns([]);
        sinon.stub(validator, 'validateEmployee').returns([mandatoryFirstNameError]);

        const mockRequest = {body: {lastName: lastName}, headers: {"if-match":"hash"}} as Request;
        mockRequest['params'] = {id: id};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.updateEmployee(mockRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([mandatoryFirstNameError]);
    });

    it('Validation error when updating employee with missing last name', async () => {
        sinon.stub(validator, 'validateId').returns([]);
        sinon.stub(validator, 'validateEmployee').returns([mandatoryLastNameError]);

        const mockRequest = {body: {firstName: firstName}, headers: {"if-match":"hash"}} as Request;
        mockRequest['params'] = {id: id};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.updateEmployee(mockRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([mandatoryLastNameError]);
    });

    it('Employee updated successfully', async () => {
        sinon.stub(validator, 'validateId').returns([]);
        sinon.stub(validator, 'validateEmployee').returns([]);

        const mockRequest = {body: employee, headers: {"if-match":"hash"}} as Request;
        mockRequest['params'] = {id: id};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        const serviceStub = sinon.stub(service, 'updateEmployee').returns(employee);

        await controller.updateEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id, employee);
        expect(mockResponse.status).to.have.been.calledWith(200);
        expect(mockResponse.send).to.have.been.calledWith(employee);
    });

    it('Error when updating employee', async () => {
        sinon.stub(validator, 'validateId').returns([]);
        sinon.stub(validator, 'validateEmployee').returns([]);

        const mockRequest = {body: employee, headers: {"if-match":"hash"}} as Request;
        mockRequest['params'] = {id: id};

        const mockResponse = {sendStatus: sinon.spy()} as Response;
        const serviceStub = sinon.stub(service, 'updateEmployee').throws(new Error("Error"));

        await controller.updateEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id, employee);
        expect(mockResponse.sendStatus).to.have.been.calledWith(500);
    });

    it('Should return a bad request for deleting employee with missing ID', async () => {
        sinon.stub(validator, 'validateId').returns([missingIdError]);

        const invalidRequest = {params: {}} as Request;

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.deleteEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([missingIdError]);
    });

    it('Should return a bad request for deleting employee with empty ID', async () => {
        sinon.stub(validator, 'validateId').returns([emptyIdError]);

        const invalidRequest = {} as Request;
        invalidRequest['params'] = {id: ""};

        const responseStatus = sinon.stub();
        const mockResponse = {status: responseStatus, send: sinon.spy()} as Response;
        responseStatus.returns(mockResponse);

        await controller.deleteEmployee(invalidRequest, mockResponse);

        expect(mockResponse.status).to.have.been.calledWith(400);
        expect(mockResponse.send).to.have.been.calledWith([emptyIdError]);
    });

    it('Should delete a employee', async () => {
        sinon.stub(validator, 'validateId').returns([]);

        const mockRequest = {} as Request;
        mockRequest['params'] = {id: id};

        const mockResponse = {sendStatus: sinon.spy()} as Response;
        const serviceStub = sinon.stub(service, 'deleteEmployee');

        await controller.deleteEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id);
        expect(mockResponse.sendStatus).to.have.been.calledWith(200);
    });

    it('Employee not deleted found', async () => {
        sinon.stub(validator, 'validateId').returns([]);

        const mockRequest = {} as Request;
        mockRequest['params'] = {id: id};

        const mockResponse = {sendStatus: sinon.stub()} as Response;
        const serviceStub = sinon.stub(service, 'deleteEmployee').throws(new Error("Error"))

        await controller.deleteEmployee(mockRequest, mockResponse);

        expect(serviceStub).to.have.been.calledOnceWith(id);
        expect(mockResponse.sendStatus).to.have.been.calledWith(500);
    });
});