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
            res.status(401);
            throw new Error('@userAuth ERROR: Not authorized, token failed');
        }
    } else {
        throw new Error('@userAuth ERROR: No token, authorization denied');
    }
}, '@userAuth ERROR: definition: ');

const adminAuth = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('@adminAuth ERROR: Not authorized as an admin');
    }

}, '@adminAuth ERROR: definition: ')

export { userAuth, adminAuth };
