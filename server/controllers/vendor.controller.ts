import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Vendor, { IVendor } from "../models/vendor.model";
import { generateVendorToken } from "../utils/token.util";
import bcrypt from 'bcryptjs';
import Verify from "../models/verify.model";
import { verifyMail } from "../utils/mail.util";

const loginVendor = handler(async (req: Request, res: Response) => {

    const vendor: IVendor | null = await Vendor.findOne({ email: req.body.email });
    if (!vendor) res.status(400).json({ message: 'Vendor does not exist' });
    else {
        const passwordMatch = await bcrypt.compare(req.body.password, vendor.password!);
        if (!passwordMatch) res.status(400).json({ message: 'Password is incorrect' });
        else {
            generateVendorToken(res, vendor._id)
            res.json({
                name: vendor.name,
                email: vendor.email,
                image: vendor.image,
                phone: vendor.phone,
                address: vendor.address,
                _id: vendor._id,
            })
        }
    }

}, '@loginVendor ERROR: ');

const createVendor = handler(async (req: Request, res: Response) => {
    const verify = await Verify.findById(req.body.codeId);
    if (!verify) return res.status(400).json({ message: 'Invalid code' });
    if (verify.code.toString() !== req.body.code) return res.status(400).json({ message: 'Invalid code' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newVendor: IVendor = new Vendor({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
        phone: req.body.phone,
        address: req.body.address,
        password: hashedPassword,
        balance: 0,
    });

    const createdVendor = await newVendor.save();
    generateVendorToken(res, createdVendor._id)
    res.json({
        name: createdVendor.name,
        email: createdVendor.email,
        image: createdVendor.image,
        phone: createdVendor.phone,
        address: createdVendor.address,
        _id: createdVendor._id,
    })
}, '@createVendor ERROR: ');

const verifyVendor = handler(async (req: Request, res: Response) => {
    const vendor: IVendor | null = await Vendor.findOne({ email: req.body.email });
    if (vendor) return res.status(400).json({ message: 'Vendor already exists' });
    if (req.body.email.endsWith('bits-pilani.ac.in')) return res.status(400).json({ message: 'You are not allowed to make a vendor account with BITS ID' })
    const newVerify = new Verify({
        code: Math.floor(100000 + Math.random() * 900000),
    });
    const createdVerify = await newVerify.save();
    verifyMail(req.body.email, createdVerify.code.toString(), 'Fezt - Verification Code for creating a VENDOR')
    return res.json({ codeId: createdVerify._id })
}, '@verifyVendor ERROR: ');

const forgotPassword = handler(async (req: Request, res: Response) => {
    const vendor: IVendor | null = await Vendor.findOne({ email: req.body.email });
    if (!vendor) return res.status(400).json({ message: 'Vendor does not exist' });
    const newVerify = new Verify({
        code: Math.floor(100000 + Math.random() * 900000),
    });
    const createdVerify = await newVerify.save();
    verifyMail(req.body.email, createdVerify.code.toString(), 'Fezt - Verification Code for resetting password')
    return res.json({ codeId: createdVerify._id })
}, '@verifyVendor ERROR: ');

const resetPassword = handler(async (req: Request, res: Response) => {
    const verify = await Verify.findById(req.body.codeId);
    if (!verify) return res.status(400).json({ message: 'Invalid code' });
    if (verify.code.toString() !== req.body.code) return res.status(400).json({ message: 'Invalid code' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const vendor: IVendor = await Vendor.findOne({ email: req.body.email }) as IVendor;
    vendor.password = hashedPassword;
    const updatedVendor = await vendor.save();
    generateVendorToken(res, updatedVendor._id)
    res.json({
        name: updatedVendor.name,
        email: updatedVendor.email,
        image: updatedVendor.image,
        phone: updatedVendor.phone,
        address: updatedVendor.address,
        _id: updatedVendor._id,
    })
}, '@resetPassword ERROR: ');

const logoutVendor = handler(async (req: Request, res: Response) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Vendor logged out', });

}, '@logoutVendor ERROR: ')

const readVendors = handler(async (req: Request, res: Response) => {
    const vendors: IVendor[] = await Vendor.find();
    res.json(vendors);
}, '@readVendors ERROR: ')

const getVendor = handler(async (req: Request, res: Response) => {
    const vendor: IVendor | null = await Vendor.findOne({ _id: req.query.vendorId });
    res.json(vendor)
}, '@getUser ERROR:')

export { loginVendor, logoutVendor, createVendor, readVendors, getVendor, verifyVendor, forgotPassword, resetPassword }