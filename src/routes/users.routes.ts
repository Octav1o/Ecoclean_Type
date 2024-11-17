import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { ObjectId } from "mongodb";
import {collections} from "../services/database.service";
import User from "../models/user";


export const userRoutes = express.Router();

userRoutes.get('/', async (req: Request, res: Response) => {
    try {

        const users = (await collections.users?.find<User>({}).toArray());

        res.status(200).send(users);

    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

userRoutes.post('/', async (req: Request, res: Response) => {
    try {

        const user = req.body as User;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const newUser = {
            firstname: user.firstname,
            lastname: user.lastname,
            mail: user.mail,
            password: hashedPassword,
            isAdmin: false ?? user.isAdmin,
            status: true
        }

        const existingUser =  await collections.users?.findOne({mail: newUser.mail});
        if (existingUser) {
            res.status(400).json({message: "User with this email already exists"});
            return;
        }
        const result = await collections.users?.insertOne(newUser);

        const payload = {
            user: {
                id: result?.insertedId,
            }
        };

        jwt.sign(
            payload,
            process.env.TOKEN ?? '',
            {expiresIn: '1 day'},
            (err, token) => {
                result
                    ? res.status(201).json({ message: `Successfully created a new user with id ${result.insertedId}`, accessToken: token})
                    : res.status(500).json({message: "Failed to create a new user", error: err?.message});
            }
        );



    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

userRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        
        const {mail, password} = req.body as User;

        if (!mail || !password) res.status(400).json({error: 'Mail and password are required'});
        
        const existingUser = await collections.users?.findOne({mail: mail});

        if (!existingUser) res.status(400).json({error: 'Wrong mail or password, try again'});
        
        

        if (await bcrypt.compare(password, existingUser?.password)) {
            res.cookie("session", "secure-session-token", {
                httpOnly: true,
                secure: true
            });

            console.log(`User with mail" ${mail} logged in successfully`);

            const accessToken = jwt.sign(
                { userId: existingUser?.id, name: existingUser?.firstname},
                process.env.TOKEN ?? '',
                { expiresIn: '1h'}
            )

            res.json({
                accessToken,
                user: {
                    userId: existingUser?.id,
                    firstname: existingUser?.firstname,
                    lastname: existingUser?.lastname,
                    mail: existingUser?.mail,
                    isAdmin: existingUser?.isAdmin,
                    status: existingUser?.status,
                }
            })
        } else {
            console.error(`Failed loggin attemp`);
            res.status(400).json({error: 'Invalid credential'});
        }

    } catch (error: any) {
        console.error('An error ocurred', error.message);
        res.status(500).json({error: 'An error ocurred'});
    }
});