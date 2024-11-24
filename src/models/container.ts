import { ObjectId } from "mongodb";
// import Alert from "./alert";

export default class Container {
    constructor(public lat: number, public lon: number, public alertId: ObjectId, status: boolean) {};
}