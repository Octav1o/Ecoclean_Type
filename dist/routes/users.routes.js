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
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { ObjectId } from "mongodb";
const database_service_1 = require("../services/database.service");
const express_validator_1 = require("express-validator");
const user_validator_1 = require("../middlewares/user.validator");
const mongodb_1 = require("mongodb");
exports.userRoutes = express_1.default.Router();
exports.userRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const users = yield ((_a = database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.find({}).toArray());
        return res.status(200).send(users);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}));
exports.userRoutes.post("/", (0, express_validator_1.checkSchema)(user_validator_1.userValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            const user = req.body;
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(user.password, salt);
            const newUser = {
                firstname: user.firstname,
                lastname: user.lastname,
                mail: user.mail,
                password: hashedPassword,
                isAdmin: false !== null && false !== void 0 ? false : user.isAdmin,
                status: true,
            };
            const existingUser = yield ((_a = database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne({
                mail: newUser.mail,
            }));
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "User with this email already exists" });
            }
            const result = yield ((_b = database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.insertOne(newUser));
            const payload = {
                user: {
                    id: result === null || result === void 0 ? void 0 : result.insertedId,
                },
            };
            jsonwebtoken_1.default.sign(payload, (_c = process.env.TOKEN) !== null && _c !== void 0 ? _c : "", { expiresIn: "1 day" }, (err, token) => {
                return result
                    ? res.status(201).json({
                        message: `Successfully created a new user with id ${result.insertedId}`,
                        accessToken: token,
                    })
                    : res.status(500).json({
                        message: "Failed to create a new user",
                        error: err === null || err === void 0 ? void 0 : err.message,
                    });
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
exports.userRoutes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { mail, password } = req.body;
        if (!mail || !password) {
            return res.status(400).json({ error: "Mail and password are required" });
        }
        const existingUser = yield ((_a = database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne({ mail: mail }));
        console.log(existingUser);
        if (!existingUser) {
            console.error('Error');
            return res.status(400).json({ error: "Wrong mail or password, try again" });
        }
        if (yield bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password)) {
            return res.cookie("session", "secure-session-token", {
                httpOnly: true,
                secure: true,
            });
            console.log(`User with mail "${mail}" logged in successfully`);
            const accessToken = jsonwebtoken_1.default.sign({ userId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id, name: existingUser === null || existingUser === void 0 ? void 0 : existingUser.firstname }, (_b = process.env.TOKEN) !== null && _b !== void 0 ? _b : "", { expiresIn: "1h" });
            return res.json({
                accessToken,
                user: {
                    userId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id,
                    firstname: existingUser === null || existingUser === void 0 ? void 0 : existingUser.firstname,
                    lastname: existingUser === null || existingUser === void 0 ? void 0 : existingUser.lastname,
                    mail: existingUser === null || existingUser === void 0 ? void 0 : existingUser.mail,
                    isAdmin: existingUser === null || existingUser === void 0 ? void 0 : existingUser.isAdmin,
                    status: existingUser === null || existingUser === void 0 ? void 0 : existingUser.status,
                },
            });
        }
        else {
            console.error(`Failed logging attempt`);
            return res.status(400).json({ error: "Invalid credential" });
        }
    }
    catch (error) {
        console.error("An error occurred", error.message);
        return res.status(500).json({ error: "An error occurred" });
    }
}));
exports.userRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const existingUser = yield ((_a = database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne({ _id: new mongodb_1.ObjectId(id) }));
        if (!existingUser)
            return res.status(404).json({ message: 'User not found' });
        const result = yield ((_b = database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { status: false } }));
        return result
            ? res.status(200).json({ message: "User deleted successfully" })
            : res.status(500).send({ message: "An error occurred while deleting the user" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}));
