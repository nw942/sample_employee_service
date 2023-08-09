
import sinon from 'sinon';
import chai, {expect, assert} from 'chai';
import sinonChai from 'sinon-chai';

import { Service } from '../../src/service/EmployeeService';
import Employee from '../../src/model/Employee';
import { EmployeeTransformer } from '../../src/transformer/EmployeeTransformer';
import { EmployeeEntity } from '../../src/dao/EmployeeEntity';
import { EmployeeDB } from '../../src/dao/EmployeeDB';
import { EmployeeMongoDB } from '../../src/dao/mongo/EmployeeMongo';


chai.use(sinonChai);

const id = "1";
const firstName = "first name";
const lastName = "last name";

var dao: EmployeeDB;
var service: Service;
var transformer: EmployeeTransformer;
var entity: EmployeeEntity;
var entities: EmployeeEntity[];
var employee: Employee;
var employees: Employee[];

describe('Service layer unit tests', () => {

    beforeEach(done => {
        dao = new EmployeeMongoDB();
        transformer = new EmployeeTransformer();
        service = new Service(dao, transformer);

        employee = new Employee();
        employee.firstName = firstName;
        employee.lastName = lastName;
        employees = [employee];

        entity = new EmployeeEntity();
        entity.firstName = firstName;
        entity.lastName = lastName;
        entities = [entity];

        sinon.reset();
        sinon.restore();
        done();
    });

    afterEach(done => {
        sinon.reset();
        sinon.restore();
        done();
    });

    it('Should get a employee using the DAO', async () => {
        const stub = sinon.stub(dao, 'getEmployee').returns(entity);
        sinon.stub(transformer, 'toEmployee').returns(employee);

        const result = await service.getEmployee(id);
        assert.equal(result, employee);
        expect(stub).to.have.been.calledOnceWith(id);
    });

    it('Employee not found', async () => {
        const stub = sinon.stub(dao, 'getEmployee').returns(null);
        const result = await service.getEmployee(id);
        assert.isNull(result);
        expect(stub).to.have.been.calledOnceWith(id);
    });

    it('Should get all employees using the DAO', async () => {
        const stub = sinon.stub(dao, 'getEmployees').returns(entities);
        sinon.stub(transformer, 'toEmployees').returns(employees);

        const result = await service.getEmployees();
        assert.equal(result, employees);
        expect(stub).to.have.been.calledOnceWith();
    });

    it('Should save a employee using the DAO', async () => {
        sinon.stub(transformer, 'toEntity').returns(entity);
        const stub = sinon.stub(dao, 'insertEmployee').returns(entity);
        sinon.stub(transformer, 'toEmployee').returns(employee);

        const result = await service.saveEmployee(employee);
        assert.equal(result, employee);
        expect(stub).to.have.been.calledOnceWith(entity);
    });

    it('Should update a employee using the DAO', async () => {
        sinon.stub(transformer, 'toEntity').returns(entity);
        const stub = sinon.stub(dao, 'updateEmployee').returns(entity);
        sinon.stub(transformer, 'toEmployee').returns(employee);

        const result = await service.updateEmployee(id, employee);
        assert.equal(result, employee);
        expect(stub).to.have.been.calledOnceWith(id, entity);
    });

    it('Should delete a employee using the DAO', async () => {
        const stub = sinon.stub(dao, 'deleteEmployee');
        await service.deleteEmployee(id);
        expect(stub).to.have.been.calledOnceWith(id);
    });
});
