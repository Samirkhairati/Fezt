import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/handler.middleware';
import User from '../models/user.model';
import { Request, Response } from 'express';

const userAuth = asyncHandler(async (req: any, res: any, next: any) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT!) as any;
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(400).json({ message: 'Not authorized as user' });
        }
    } else {
        throw new Error('@userAuth ERROR: No token, authorization denied');
    }
}, '@userAuth ERROR: definition: ');


export { userAuth };
