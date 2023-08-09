
import { EmployeeEntity } from './EmployeeEntity';

export interface EmployeeDB {

    getEmployees(): Promise<EmployeeEntity[]>;
    
    getEmployee(id: string): Promise<EmployeeEntity>;

    insertEmployee(employee: EmployeeEntity): Promise<EmployeeEntity>;

    updateEmployee(id: string, employee: EmployeeEntity): Promise<EmployeeEntity>;

    deleteEmployee(id: string): Promise<void>;
}
