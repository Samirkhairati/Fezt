import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import User, { IUser } from "../models/user.model";
import generateToken from "../utils/token.util";

const loginUser = handler(async (req: Request, res: Response) => {

    const user: IUser | null = await User.findOne({ email: req.body.email });
    if (user) {
        generateToken(res, user._id)
        res.json(user)
    } else res.json();

}, '@loginUser ERROR: ');

const createUser = handler(async (req: Request, res: Response) => {
    const newUser: IUser = new User({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
        phone: req.body.phone,
        address: req.body.address,
        bits: req.body.bits,
        balance: 12000,
    });
    const createdUser = await newUser.save();
    generateToken(res, createdUser._id)
    res.json({
        name: createdUser.name,
        email: createdUser.email,
        image: createdUser.image,
        phone: createdUser.phone,
        address: createdUser.address,
        bits: createdUser.bits,
        _id: createdUser._id,
        balance: createdUser.balance,
    })
}, '@creatUser ERROR: ');

const logoutUser = handler(async (req: Request, res: Response) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'User logged out', });

}, '@logoutUser ERROR: ')

export { loginUser, logoutUser, createUser }