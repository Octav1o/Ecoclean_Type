import express, { Request, Response } from 'express';
import { sendPushNotification } from '../services/push.notifications.service';
import { storeSubscription } from '../subscriptions/store.subscriptions';
import { collections } from '../services/database.service';

export const notificationsRouter = express.Router();



notificationsRouter.post('/subscribe', async (req: Request, res: Response) => {
    const { subscription } = req.body;

    console.log('Datos recibidos en el backend: ', {subscription});

    if (!subscription) {
        res.status(400).json({ message: 'Suscripcion o payload no validos'});
    } else {
        try {
            await storeSubscription(subscription);
            res.status(200).json({ message: "Suscripcion guardada correctamente"});
        } catch (error:any) {
            console.error('Error al procesar la suscripción: ', error.message);
            res.status(500).json({ message: 'Error al almacenar la suscripción', error: error.message });
        }
    }
})


notificationsRouter.post('/send', async (req: Request, res: Response) => {
    const { payload } = req.body;

    if (!payload) {
        res.status(400).json({ message: 'El payload es necesario para enviar una notificación' });
    }

    try {
        const subscriptions = await collections.subscriptions?.find({}).toArray();

        if (!subscriptions || subscriptions.length === 0) {
            res.status(404).json({ message: 'No hay suscripciones disponibles' });
        }

        // Crear las promesas para enviar las notificaciones
        const sendPromises = subscriptions?.map((subscription) =>
            sendPushNotification(subscription, payload)
        );

        // Verifica que sendPromises no sea undefined o vacío
        if (sendPromises!.length > 0) {
            // Enviar todas las notificaciones
            await Promise.all(sendPromises!);
            res.status(200).json({ message: 'Notificación enviada a todos los suscriptores' });
        } else {
            res.status(400).json({ message: 'No hay suscriptores a los que enviar notificación' });
        }
    } catch (error: any) {
        console.error('Error al enviar la notificación: ', error.message);
        res.status(500).json({ message: 'Error al enviar la notificación', error: error.message });
    }
});