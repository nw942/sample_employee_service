
import Employee from '../model/Employee';
import { EmployeeEntity } from '../dao/EmployeeEntity';
import { ObjectId } from 'mongodb';


export class EmployeeTransformer {

    // Transform the data from the API representation (model) to the data store representation (entity/DAO).
    public toEntity(employee: Employee): EmployeeEntity {
        const entity = new EmployeeEntity();
        entity._id = new ObjectId(employee._id);
        entity.firstName = employee.firstName;
        entity.lastName = employee.lastName;
        entity.otherNames = employee.otherNames;

        return entity;
    }

    // Transform the data from the data store representation (entity/DAO) to the API representation (model).
    public toEmployee(entity: EmployeeEntity): Employee {
        return this.entityToEmployee(entity);
    }

    // Transform the data from the data store representation (entity/DAO) to the API representation (model).
    public toEmployees(entities: EmployeeEntity[]): Employee[] {
        const employees:Array<Employee> = [];

        const thisTransformer:EmployeeTransformer = this
        entities.forEach(function(entity: EmployeeEntity) {
            employees.push(thisTransformer.entityToEmployee(entity));
        });

        return employees;
    }

    // Transform the data from the API representation (model) to the data store representation (entity/DAO).
    private entityToEmployee(entity: EmployeeEntity): Employee {
        const employee = new Employee();
        employee._id = entity._id?.toString();
        employee.firstName = entity.firstName;
        employee.otherNames = entity.otherNames;
        employee.lastName = entity.lastName;

        return employee;
    }    
}
