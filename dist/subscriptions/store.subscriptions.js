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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSubscription = storeSubscription;
const database_service_1 = require("../services/database.service");
function storeSubscription(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            // Asegúrate de que la suscripción tenga los datos requeridos
            const { endpoint, keys } = subscription;
            if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
                throw new Error("Datos incompletos en la suscripción");
            }
            const existingSubscription = yield ((_a = database_service_1.collections.subscriptions) === null || _a === void 0 ? void 0 : _a.findOne({ endpoint }));
            if (existingSubscription) {
                console.log('La subscripcion ya existe: ', existingSubscription);
                return;
            }
            // Crea el objeto para la base de datos
            const subscriptionDocument = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth
                },
                createdAt: new Date() // Para saber cuándo se creó
            };
            // Guarda la suscripción en la base de datos
            const result = yield ((_b = database_service_1.collections.subscriptions) === null || _b === void 0 ? void 0 : _b.insertOne(subscriptionDocument));
            console.log("Suscripción almacenada con éxito:", result);
        }
        catch (error) {
            console.error("Error al almacenar la suscripción:", error);
        }
    });
}
