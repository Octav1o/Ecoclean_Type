import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/user";
import { checkSchema, validationResult } from "express-validator";
import { loginValidator, userValidator } from "../middlewares/user.validator";

export const userRoutes = express.Router();

userRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const users = await collections.users?.find<User>({}).toArray();

    res.status(200).send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

userRoutes.post(
  "/",
  checkSchema(userValidator),
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const user = req.body as User;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const newUser = {
          firstname: user.firstname,
          lastname: user.lastname,
          mail: user.mail,
          password: hashedPassword,
          isAdmin: false ?? user.isAdmin,
          status: true,
        };

        const existingUser = await collections.users?.findOne({
          mail: newUser.mail,
        });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "User with this email already exists" });
        }
        const result = await collections.users?.insertOne(newUser);

        const payload = {
          user: {
            id: result?.insertedId,
          },
        };

        jwt.sign(
          payload,
          process.env.TOKEN ?? "",
          { expiresIn: "1 day" },
          (err, token) => {
            result
              ? res.status(201).json({
                  message: `Successfully created a new user with id ${result.insertedId}`,
                  accessToken: token,
                })
              : res.status(500).json({
                  message: "Failed to create a new user",
                  error: err?.message,
                });
          }
        );
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }
);

userRoutes.post("/login", async (req: Request, res: Response): Promise<Response> => {
  try {
    const { mail, password } = req.body as User;

    if (!mail || !password) {
      return res.status(400).json({ error: "Mail and password are required" });
    }

    const existingUser = await collections.users?.findOne({ mail: mail });
    console.log(existingUser);
    if (!existingUser) {
      console.error('Error')
      return res.status(400).json({ error: "Wrong mail or password, try again" });
    }

    if (await bcrypt.compare(password, existingUser?.password)) {
      res.cookie("session", "secure-session-token", {
        httpOnly: true,
        secure: true,
      });

      console.log(`User with mail "${mail}" logged in successfully`);

      const accessToken = jwt.sign(
        { userId: existingUser?.id, name: existingUser?.firstname },
        process.env.TOKEN ?? "",
        { expiresIn: "1h" }
      );

      return res.json({
        accessToken,
        user: {
          userId: existingUser?.id,
          firstname: existingUser?.firstname,
          lastname: existingUser?.lastname,
          mail: existingUser?.mail,
          isAdmin: existingUser?.isAdmin,
          status: existingUser?.status,
        },
      });
    } else {
      console.error(`Failed logging attempt`);
      return res.status(400).json({ error: "Invalid credential" });
    }
  } catch (error: any) {
    console.error("An error occurred", error.message);
    return res.status(500).json({ error: "An error occurred" });
  }
});