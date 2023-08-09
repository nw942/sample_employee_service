
import { ObjectId } from "mongodb";

export class EmployeeEntity {

    public firstName: string
    public otherNames: string
    public lastName: string
    public _id?: ObjectId
}
