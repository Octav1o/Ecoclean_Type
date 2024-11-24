import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import TrashBin from "../models/container";
("../models/trashBin");
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";
// import Container from "../models/container";

export const containerRoutes = express.Router();

containerRoutes.post("/", async (req: Request, res: Response) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
    const {lat, lon, alertId} = req.body as TrashBin;
    if(!ObjectId.isValid(alertId)) return res.status(400).json({ message: 'Invalid Alert ID'});

    const alert = await collections.alerts?.findOne({ _id: new ObjectId(alertId)});

    if(!alert) return res.status(404).json({ message: 'Alert not found'});

    const newContainer = {
      lat,
      lon,
      alert: new ObjectId(alertId),
      status: true
    };

    const result = await collections.containers?.insertOne(newContainer);

    result
            ? res.status(201).json({ message: "Container created successfully" })
            : res.status(500).send({ message: "An error occurred while creating the container" });

  } catch (error: any) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});


// containerRoutes.get("/", async (req: Request, res: Response) => {

//   try {

//     // const containers = await collections.containers?.find<Container>({}).toArray();
//     const containers = await collections.containers?.aggregate([
//       {
//         $lookup: {
//           from: 'alerts',
//           localField: 'alert',
//           foreignField: '_id',
//           as: 'alertDetails'
//         }
//       },
//       {
//         $unwind: {
//           path: '$alertDetails',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           lat: 1,
//           lon: 1,
//           status: 1,
//           alertDetails: 1
//         }
//       }
//     ]).toArray();

//     console.log(containers);
//     return res.status(200).send(containers);

//   } catch (error:any) {
    
//     console.error(error);
//     return res.status(500).send(error.message);
//   }

// });

containerRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const matchStage = status ? { 'alertDetails.status': status } : {};

    const containers = await collections.containers?.aggregate([
      {
        $lookup: {
          from: 'alerts',
          localField: 'alert',
          foreignField: '_id',
          as: 'alertDetails'
        }
      },
      {
        $unwind: {
          path: '$alertDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: matchStage
      },
      {
        $project: {
          _id: 1,
          lat: 1,
          lon: 1,
          status: 1,
          alertDetails: 1
        }
      }
    ]).toArray();

    console.log(containers);
    return res.status(200).send(containers);

  } catch (error:any) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

containerRoutes.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    
    const container = await collections.containers?.aggregate([
      {
        $match: { _id: new ObjectId(id)}
      },
      {
        $lookup: {
          from: 'alerts',
          localField: 'alert',
          foreignField: '_id',
          as: 'alertDetails'
        }
      },
      {
        $unwind: {
          path: '$alertDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          lat: 1,
          lon: 1,
          status: 1,
          alertDetails: 1
        }
      }
    ]).next()
  
    if(!container) return res.status(404).json({message: 'Container not found'});
  
    return res.status(200).send(container);

  } catch (error:any) {
    console.error(error);
    return res.status(500).send(error.message);
  }

});

containerRoutes.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { lat, lon } = req.body;

  try {
    
    const container = await collections.containers?.findOne({ _id: new ObjectId(id)});

    if(!container) return res.status(404).json({message: 'Container not found'});

    const updatedContainer = await collections.containers?.updateOne(
      { _id: new ObjectId(id)},
      { $set: { lat, lon } }
    );

    if(updatedContainer) {
      return res.status(200).json({ message: 'Container updated successfully' });
    } else {
      return res.status(500).json({ message: 'An error occurred while updating the container' });
    }

  } catch (error: any) {
    console.error(error);
    return res.status(500).send(error.message);
  }
})

containerRoutes.delete('/:id', async (req: Request, res: Response) => {

  const { id } = req.params;

  try {
    
    const existingContainer = await collections.containers?.findOne({ _id: new ObjectId(id)});

    console.log(existingContainer);

    if(!existingContainer) return res.status(404).json({message: 'Container not found'});

    const result = await collections.containers?.updateOne({_id: new ObjectId(id)}, {$set: { status: false}});

    result
     ? res.status(200).json({ message: "Container deleted successfully"})
      : res.status(500).send({ message: "An error occurred while deleting the container"});

  } catch (error:any) {
    console.error(error);
    return res.status(500).send(error.message);
  }

})