"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
exports.connectToDatabase = connectToDatabase;
const mongoDB = __importStar(require("mongodb"));
const dotenv = __importStar(require("dotenv"));
exports.collections = {};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        dotenv.config();
        const client = new mongoDB.MongoClient((_a = process.env.DB_CONN_STRING) !== null && _a !== void 0 ? _a : "");
        yield client.connect();
        const db = client.db(process.env.DB_NAME);
        const userCollection = db.collection((_b = process.env.USER_COLLECTION_NAME) !== null && _b !== void 0 ? _b : "");
        const alertCollection = db.collection((_c = process.env.ALERT_COLLECTION_NAME) !== null && _c !== void 0 ? _c : "");
        const conteinerCollection = db.collection((_d = process.env.CONTAINER_COLLECTION_NAME) !== null && _d !== void 0 ? _d : "");
        const subscriptionCollection = db.collection((_e = process.env.SUBSCRIPTIONS_COLLECTION_NAME) !== null && _e !== void 0 ? _e : "");
        exports.collections.users = userCollection;
        exports.collections.alerts = alertCollection;
        exports.collections.containers = conteinerCollection;
        exports.collections.subscriptions = subscriptionCollection;
        console.log(`Successfully connected to database: ${db.databaseName} and collections: ${userCollection.collectionName}, ${alertCollection.collectionName}`);
    });
}
