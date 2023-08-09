
import Employee from '../model/Employee';
import { EmployeeDB } from '../dao/EmployeeDB';
import { EmployeeTransformer } from '../transformer/EmployeeTransformer';

export class Service {

    private dao: EmployeeDB;
    private transformer: EmployeeTransformer;


    constructor(dao: EmployeeDB, transformer: EmployeeTransformer) {
        this.dao = dao;
        this.transformer = transformer;
    }

    public async getEmployees(): Promise<Employee[]> {
        const entities = await this.dao.getEmployees();
        return this.transformer.toEmployees(entities);
    }

    public async getEmployee(id: string): Promise<Employee> {
        const entity = await this.dao.getEmployee(id);
        if(entity) {
            return this.transformer.toEmployee(entity);
        }
        return null as unknown as Employee;
    }

    public async saveEmployee(employee: Employee): Promise<Employee> {
        const entity = this.transformer.toEntity(employee);
        const result = await this.dao.insertEmployee(entity);
        return this.transformer.toEmployee(result);
    }

    public async updateEmployee(id: string, employee: Employee): Promise<Employee> {
        const entity = this.transformer.toEntity(employee);
        const result = await this.dao.updateEmployee(id, entity);
        return this.transformer.toEmployee(result);
    }

    public async deleteEmployee(id: string) {
        await this.dao.deleteEmployee(id);
    }
}
