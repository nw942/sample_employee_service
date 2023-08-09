
import Employee from '../model/Employee';
import { Logger } from '../libraries/logging/logger';


const log = Logger.getLogger("validator.Employee");

export class Validator {

    public validateId(id: string) {
        const errors:Array<string> = []

        if(id === null) {
            log.trace("Validation failed - ID is missing");
            errors.push("ID must be supplied");
            return errors;
        }

        if(id.length == 0) {
            log.trace("Validation failed - ID is empty");
            errors.push("A value must be supplied for the ID");
        }

        return errors;
    }

    public validateEmployee(employee: Employee) {
        const errors:Array<string> = []

        if(!employee.firstName) {
            log.trace("Validation failed - First name is empty");
            errors.push("First name must not be empty");
        }

        if(!employee.lastName) {
            log.trace("Validation failed - Last name is empty");
            errors.push("Last name must not be empty");
        }

        return errors;
    }
}
