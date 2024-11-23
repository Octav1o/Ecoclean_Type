import express, { Request, Response } from "express";
// import { ObjectId } from "mongodb";
import {collections} from "../services/database.service";
import Alert from "../models/alert";

export const alertRoutes = express.Router();

alertRoutes.get('/', async (req: Request, res: Response) => {
    try {
        
        const alerts = await collections.alerts?.find<Alert>({}).toArray();

        res.status(200).send(alerts);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});


alertRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const alert = req.body as Alert;
        console.log(alert);
        const newAlert = {
            message: alert.message,
            sensorId: alert.sensorId,
            dateCreation: new Date(),
            status: alert.status
        }
        
        const existingAlert = await collections.alerts?.findOne({sensorId: newAlert.sensorId});
        

        if (existingAlert) {
            res.status(400).json({message: `Alerta existente`});
            return;
        };

        const result = await collections.alerts?.insertOne(newAlert);

        result
            ? res.status(201).json({message: "Alert created successfully"})
            : res.status(500).send({message: "An error ocurred trying to create the alert"});
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


alertRoutes.put('/updateAlert', async (req: Request, res: Response) => {

    try {
        
        const {message, sensorId, status} = req.body as Alert;

        const existingAlert = await collections.alerts?.findOne({sensorId: sensorId});

        if (!existingAlert) res.status(404).send(`We couldn't find the alert with sensorId ${sensorId}`);

        const result = await collections.alerts?.updateOne({sensorId: sensorId}, {$set: {message: message, status: status}});

        result
            ? res.status(201).json({message: "Alert updated successfully"})
            : res.status(500).send({message: "An error ocurred while updating the alert"});

    } catch (error:any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }

});