import jwt from 'jsonwebtoken';
import handler from '../middleware/handler.middleware';
import User from '../models/user.model';
import { Request, Response } from 'express';
import Vendor from '../models/vendor.model';

const userAuth = handler(async (req: any, res: any, next: any) => {
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

const vendorAuth = handler(async (req: any, res: any, next: any) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT!) as any;
            req.vendor = await Vendor.findById(decoded.vendorId).select('-password');
            next();
        } catch (error) {
            res.status(400).json({ message: 'Not authorized as vendor' });
        }
    } else {
        throw new Error('@vendorAuth ERROR: No token, authorization denied');
    }
}, '@vendorAuth ERROR: definition: ');


export { userAuth, vendorAuth };
