"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import { ObjectId } from "mongodb";
const database_service_1 = require("../services/database.service");
exports.alertRoutes = express_1.default.Router();
exports.alertRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const alerts = yield ((_a = database_service_1.collections.alerts) === null || _a === void 0 ? void 0 : _a.find({}).toArray());
        return res.status(200).send(alerts);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}));
exports.alertRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const alert = req.body;
        console.log(alert);
        const newAlert = {
            message: alert.message,
            sensorId: alert.sensorId,
            dateCreation: new Date(),
            status: alert.status
        };
        const existingAlert = yield ((_a = database_service_1.collections.alerts) === null || _a === void 0 ? void 0 : _a.findOne({ sensorId: newAlert.sensorId }));
        if (existingAlert) {
            const updateAlert = yield ((_b = database_service_1.collections.alerts) === null || _b === void 0 ? void 0 : _b.updateOne({ sensorId: alert.sensorId }, { $set: { status: 'critico', message: 'Contenedor en estado critico' } }));
            return updateAlert
                ? res.status(201).json({ message: "Alert updated successfully" })
                : res.status(500).send({ message: "An error ocurred while updating the alert" });
        }
        const result = yield ((_c = database_service_1.collections.alerts) === null || _c === void 0 ? void 0 : _c.insertOne(newAlert));
        return result
            ? res.status(201).json({ message: "Alert created successfully" })
            : res.status(500).send({ message: "An error ocurred trying to create the alert" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
exports.alertRoutes.put('/updateAlert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { message, sensorId, status } = req.body;
        console.log(req.body);
        const existingAlert = yield ((_a = database_service_1.collections.alerts) === null || _a === void 0 ? void 0 : _a.findOne({ sensorId: sensorId }));
        if (!existingAlert)
            return res.status(404).send(`We couldn't find the alert with sensorId ${sensorId}`);
        const result = yield ((_b = database_service_1.collections.alerts) === null || _b === void 0 ? void 0 : _b.updateOne({ sensorId: sensorId }, { $set: { message: message, status: status } }));
        return result
            ? res.status(201).json({ message: "Alert updated successfully" })
            : res.status(500).send({ message: "An error ocurred while updating the alert" });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
}));
