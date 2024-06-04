import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import User, { IUser } from "../models/user.model";
import generateToken from "../utils/token.util";

const loginUser = handler(async (req: Request, res: Response) => {

    const user: IUser | null = await User.findOne({ email: req.body.email });
    if (user) {
        generateToken(res, user._id)
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image,
        });
        const createdUser = await newUser.save();
        generateToken(res, createdUser._id)
        res.json(createdUser)
    }

}, '@loginUser ERROR: ');

const logoutUser = handler(async (req: Request, res: Response) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'User logged out', });

}, '@logoutUser ERROR: ')

export { loginUser, logoutUser }