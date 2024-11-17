import { ObjectId } from "mongodb";

export default class Alert {
    constructor(public message: string, public sensorId: number , public dateCreation: Date, public status: string, public id?: ObjectId) {}
}