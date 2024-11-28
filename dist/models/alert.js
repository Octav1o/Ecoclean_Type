"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Alert {
    constructor(message, sensorId, dateCreation, status) {
        this.message = message;
        this.sensorId = sensorId;
        this.dateCreation = dateCreation;
        this.status = status;
    }
}
exports.default = Alert;
