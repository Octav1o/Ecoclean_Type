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
exports.notificationsRouter = void 0;
const express_1 = __importDefault(require("express"));
const push_notifications_service_1 = require("../services/push.notifications.service");
const store_subscriptions_1 = require("../subscriptions/store.subscriptions");
const database_service_1 = require("../services/database.service");
exports.notificationsRouter = express_1.default.Router();
exports.notificationsRouter.post('/subscribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscription } = req.body;
    console.log('Datos recibidos en el backend: ', { subscription });
    if (!subscription) {
        res.status(400).json({ message: 'Suscripcion o payload no validos' });
    }
    else {
        try {
            yield (0, store_subscriptions_1.storeSubscription)(subscription);
            res.status(200).json({ message: "Suscripcion guardada correctamente" });
        }
        catch (error) {
            console.error('Error al procesar la suscripción: ', error.message);
            res.status(500).json({ message: 'Error al almacenar la suscripción', error: error.message });
        }
    }
}));
exports.notificationsRouter.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { payload } = req.body;
    if (!payload) {
        res.status(400).json({ message: 'El payload es necesario para enviar una notificación' });
    }
    try {
        const subscriptions = yield ((_a = database_service_1.collections.subscriptions) === null || _a === void 0 ? void 0 : _a.find({}).toArray());
        if (!subscriptions || subscriptions.length === 0) {
            res.status(404).json({ message: 'No hay suscripciones disponibles' });
        }
        // Crear las promesas para enviar las notificaciones
        const sendPromises = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.map((subscription) => (0, push_notifications_service_1.sendPushNotification)(subscription, payload));
        // Verifica que sendPromises no sea undefined o vacío
        if (sendPromises.length > 0) {
            // Enviar todas las notificaciones
            yield Promise.all(sendPromises);
            res.status(200).json({ message: 'Notificación enviada a todos los suscriptores' });
        }
        else {
            res.status(400).json({ message: 'No hay suscriptores a los que enviar notificación' });
        }
    }
    catch (error) {
        console.error('Error al enviar la notificación: ', error.message);
        res.status(500).json({ message: 'Error al enviar la notificación', error: error.message });
    }
}));
