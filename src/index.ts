import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import { itemsRouter } from './items/items.router'
import { userRoutes } from './routes/users.routes';
import { connectToDatabase } from './services/database.service';
import { alertRoutes } from './routes/alerts.routes';
import { containerRoutes } from './routes/containers.routes';
import { notificationsRouter } from './routes/notifications.routes';
import webPush from 'web-push';

dotenv.config();

if (!process.env.PORT) process.exit(1);

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
// console.log(vapidPublicKey);
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
// console.log(vapidPrivateKey);
webPush.setVapidDetails(
    'mailto:o.buenfilc2@gmail.com',
    vapidPublicKey!,
    vapidPrivateKey!,
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Connected to API');
});

connectToDatabase()
    .then(() => {
        app.use("/api/users", userRoutes);
        app.use("/api/alerts", alertRoutes);
        app.use("/api/containers", containerRoutes);
        app.use("/api/notifications", notificationsRouter)

        app.listen(PORT, () => {
            console.log(`App listening on PORT: ${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error('Failed to connect to database', error);
        process.exit(1);
    })