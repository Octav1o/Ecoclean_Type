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
exports.sendPushNotification = void 0;
const web_push_1 = __importDefault(require("web-push"));
const sendPushNotification = (subscription, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        TTL: 60 * 60
    };
    if (!subscription || !subscription.endpoint) {
        throw new Error('Subscripcion no valida o falta el endpoint');
    }
    try {
        const stringifiedPayload = JSON.stringify(payload);
        const response = yield web_push_1.default.sendNotification(subscription, stringifiedPayload, options);
        console.log('Notificacion enviada con exito', response);
    }
    catch (err) {
        console.error('Error al enviar la notificacion', err);
    }
});
exports.sendPushNotification = sendPushNotification;
