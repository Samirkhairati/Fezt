import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import User, { IUser } from "../models/user.model";
import { generateUserToken } from "../utils/token.util";
import admin from '../index';

const loginUser = handler(async (req: Request, res: Response) => {
    const decodedToken = await admin.auth().verifyIdToken(req.body.token);
    const user: IUser | null = await User.findOne({ email: req.body.email });
    if (decodedToken.uid !== req.body.uid) return res.status(400).json({ message: 'Invalid token' });
    if (user) {
        generateUserToken(res, user._id)
        return res.json(user)
    }
    if (!req.body.email.endsWith('bits-pilani.ac.in')) res.status(400).json({ message: 'Please use a BITS email address' });
    else {
        res.json();
    }

}, '@loginUser ERROR: ');

const createUser = handler(async (req: Request, res: Response) => {
    const decodedToken = await admin.auth().verifyIdToken(req.body.token);
    if (decodedToken.uid !== req.body.uid) return res.status(400).json({ message: 'Invalid token' });
    if (!req.body.email.endsWith('bits-pilani.ac.in')) return res.status(400).json({ message: 'Please use a BITS email address' });
    else {
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
        generateUserToken(res, createdUser._id)
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
    }

}, '@createUser ERROR: ');

const logoutUser = handler(async (req: Request, res: Response) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'User logged out', });

}, '@logoutUser ERROR: ')

const getUser = handler(async (req: Request, res: Response) => {
    const user: IUser | null = await User.findOne({ _id: req.query.userId });
    res.json(user)
}, '@getUser ERROR:')

export { loginUser, logoutUser, createUser, getUser }