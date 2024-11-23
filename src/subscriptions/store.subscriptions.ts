import { collections } from "../services/database.service";

export async function storeSubscription(subscription: any) {
    try {
      // Asegúrate de que la suscripción tenga los datos requeridos
      const { endpoint, keys } = subscription;
  
      if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
        throw new Error("Datos incompletos en la suscripción");
      }
      
      const existingSubscription = await collections.subscriptions?.findOne({ endpoint });

      if(existingSubscription) {
        console.log('La subscripcion ya existe: ', existingSubscription)
        return;
      }
      // Crea el objeto para la base de datos
      const subscriptionDocument = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        },
        createdAt: new Date()  // Para saber cuándo se creó
      };
  
      // Guarda la suscripción en la base de datos
      const result = await collections.subscriptions?.insertOne(subscriptionDocument);
      console.log("Suscripción almacenada con éxito:", result);
    } catch (error) {
      console.error("Error al almacenar la suscripción:", error);
    }
  }