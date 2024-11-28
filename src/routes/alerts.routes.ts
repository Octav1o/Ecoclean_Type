import express, { Request, Response } from "express";
// import { ObjectId } from "mongodb";
import {collections} from "../services/database.service";
import Alert from "../models/alert";

export const alertRoutes = express.Router();

alertRoutes.get('/', async (req: Request, res: Response) => {
    try {
        
        const alerts = await collections.alerts?.find<Alert>({}).toArray();

        return res.status(200).send(alerts);
    } catch (error: any) {
        return res.status(500).send(error.message);
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
            const updateAlert = await collections.alerts?.updateOne(
                {sensorId: alert.sensorId}, 
                {$set: {status: 'critico', message: 'Contenedor en estado critico'}}
            );
            return updateAlert
            ? res.status(201).json({message: "Alert updated successfully"})
            : res.status(500).send({message: "An error ocurred while updating the alert"});
            
        }

        const result = await collections.alerts?.insertOne(newAlert);

        return result
            ? res.status(201).json({message: "Alert created successfully"})
            : res.status(500).send({message: "An error ocurred trying to create the alert"});
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
});


alertRoutes.put('/updateAlert', async (req: Request, res: Response) => {

    try {
        
        const {message, sensorId, status} = req.body as Alert;
        console.log(req.body);
        const existingAlert = await collections.alerts?.findOne({sensorId: sensorId});

        if (!existingAlert) return res.status(404).send(`We couldn't find the alert with sensorId ${sensorId}`);

        const result = await collections.alerts?.updateOne({sensorId: sensorId}, {$set: {message: message, status: status}});

        return result
            ? res.status(201).json({message: "Alert updated successfully"})
            : res.status(500).send({message: "An error ocurred while updating the alert"});

    } catch (error:any) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }

});