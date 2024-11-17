import { ObjectId } from "mongodb";

export default class User {
    constructor(public firstname: string, public lastname: string ,public mail: string, public password: string, public isAdmin: boolean, public status: boolean, public id?: ObjectId) {}
}