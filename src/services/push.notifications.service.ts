import webPush from "web-push"

export const sendPushNotification = async (subscription: any, payload: string) => {
    const options = {
        TTL: 60 * 60
    };

    if(!subscription || !subscription.endpoint) {
        throw new Error('Subscripcion no valida o falta el endpoint');
    }

    try {
        const stringifiedPayload = JSON.stringify(payload);
        const response = await webPush.sendNotification(subscription, stringifiedPayload, options);
        console.log('Notificacion enviada con exito', response);
    } catch (err) {
        console.error('Error al enviar la notificacion', err);
    }
}