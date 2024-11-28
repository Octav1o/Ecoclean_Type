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
exports.containerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
("../models/trashBin");
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
// import Container from "../models/container";
exports.containerRoutes = express_1.default.Router();
exports.containerRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { lat, lon, alertId } = req.body;
        if (!mongodb_1.ObjectId.isValid(alertId))
            return res.status(400).json({ message: 'Invalid Alert ID' });
        const alert = yield ((_a = database_service_1.collections.alerts) === null || _a === void 0 ? void 0 : _a.findOne({ _id: new mongodb_1.ObjectId(alertId) }));
        if (!alert)
            return res.status(404).json({ message: 'Alert not found' });
        const newContainer = {
            lat,
            lon,
            alert: new mongodb_1.ObjectId(alertId),
            status: true
        };
        const result = yield ((_b = database_service_1.collections.containers) === null || _b === void 0 ? void 0 : _b.insertOne(newContainer));
        result
            ? res.status(201).json({ message: "Container created successfully" })
            : res.status(500).send({ message: "An error occurred while creating the container" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
// containerRoutes.get("/", async (req: Request, res: Response) => {
//   try {
//     // const containers = await collections.containers?.find<Container>({}).toArray();
//     const containers = await collections.containers?.aggregate([
//       {
//         $lookup: {
//           from: 'alerts',
//           localField: 'alert',
//           foreignField: '_id',
//           as: 'alertDetails'
//         }
//       },
//       {
//         $unwind: {
//           path: '$alertDetails',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           lat: 1,
//           lon: 1,
//           status: 1,
//           alertDetails: 1
//         }
//       }
//     ]).toArray();
//     console.log(containers);
//     return res.status(200).send(containers);
//   } catch (error:any) {
//     console.error(error);
//     return res.status(500).send(error.message);
//   }
// });
exports.containerRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { status } = req.query;
        const matchStage = status ? { 'alertDetails.status': status } : {};
        const containers = yield ((_a = database_service_1.collections.containers) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: 'alerts',
                    localField: 'alert',
                    foreignField: '_id',
                    as: 'alertDetails'
                }
            },
            {
                $unwind: {
                    path: '$alertDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: matchStage
            },
            {
                $project: {
                    _id: 1,
                    lat: 1,
                    lon: 1,
                    status: 1,
                    alertDetails: 1
                }
            }
        ]).toArray());
        console.log(containers);
        return res.status(200).send(containers);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
exports.containerRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const container = yield ((_a = database_service_1.collections.containers) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $match: { _id: new mongodb_1.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'alerts',
                    localField: 'alert',
                    foreignField: '_id',
                    as: 'alertDetails'
                }
            },
            {
                $unwind: {
                    path: '$alertDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    lat: 1,
                    lon: 1,
                    status: 1,
                    alertDetails: 1
                }
            }
        ]).next());
        if (!container)
            return res.status(404).json({ message: 'Container not found' });
        return res.status(200).send(container);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
exports.containerRoutes.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const { lat, lon } = req.body;
    try {
        const container = yield ((_a = database_service_1.collections.containers) === null || _a === void 0 ? void 0 : _a.findOne({ _id: new mongodb_1.ObjectId(id) }));
        if (!container)
            return res.status(404).json({ message: 'Container not found' });
        const updatedContainer = yield ((_b = database_service_1.collections.containers) === null || _b === void 0 ? void 0 : _b.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { lat, lon } }));
        if (updatedContainer) {
            return res.status(200).json({ message: 'Container updated successfully' });
        }
        else {
            return res.status(500).json({ message: 'An error occurred while updating the container' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
exports.containerRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    try {
        const existingContainer = yield ((_a = database_service_1.collections.containers) === null || _a === void 0 ? void 0 : _a.findOne({ _id: new mongodb_1.ObjectId(id) }));
        console.log(existingContainer);
        if (!existingContainer)
            return res.status(404).json({ message: 'Container not found' });
        // const result = await collections.containers?.updateOne({_id: new ObjectId(id)}, {$set: { status: false}});
        const result = yield ((_b = database_service_1.collections.containers) === null || _b === void 0 ? void 0 : _b.deleteOne({ _id: new mongodb_1.ObjectId(id) }));
        result
            ? res.status(200).json({ message: "Container deleted successfully" })
            : res.status(500).send({ message: "An error occurred while deleting the container" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
