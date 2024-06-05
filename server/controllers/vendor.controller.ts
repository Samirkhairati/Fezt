import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Vendor, { IVendor } from "../models/vendor.model";
import generateToken from "../utils/token.util";
import bcrypt from 'bcryptjs';

const loginVendor = handler(async (req: Request, res: Response) => {

    const vendor: IVendor | null = await Vendor.findOne({ email: req.body.email });
    if (!vendor) throw new Error('Vendor not found');

    const passwordMatch = await bcrypt.compare(req.body.password, vendor.password!);
    if (!passwordMatch) throw new Error('Invalid password');

    generateToken(res, vendor._id)
    res.json({
        name: vendor.name,
        email: vendor.email,
        image: vendor.image,
        phone: vendor.phone,
        address: vendor.address,
        _id: vendor._id,
    })

}, '@loginVendor ERROR: ');

const createVendor = handler(async (req: Request, res: Response) => {
    const vendor: IVendor | null = await Vendor.findOne({ email: req.body.email });
    if (vendor) throw new Error('Vendor already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newVendor: IVendor = new Vendor({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
        phone: req.body.phone,
        address: req.body.address,
        password: hashedPassword,
    });

    const createdVendor = await newVendor.save();
    generateToken(res, createdVendor._id)
    res.json({
        name: createdVendor.name,
        email: createdVendor.email,
        image: createdVendor.image,
        phone: createdVendor.phone,
        address: createdVendor.address,
        _id: createdVendor._id,
    })
}, '@createVendor ERROR: ');

const logoutVendor = handler(async (req: Request, res: Response) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Vendor logged out', });

}, '@logoutVendor ERROR: ')

export { loginVendor, logoutVendor, createVendor }