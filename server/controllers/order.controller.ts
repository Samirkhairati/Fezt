import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Vendor, { IVendor } from "../models/vendor.model";
import Item, { IItem } from "../models/item.model";
import User, { IUser } from "../models/user.model";
import Order, { IOrder } from "../models/order.model";

const createOrder = handler(async (req: any, res: Response) => {
    if (req.body.user.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to place this order' })
    else {
        const user: IUser | null = await User.findOne({ _id: req.body.user });
        const vendor: IVendor | null = await Vendor.findOne({ _id: req.body.vendor });
        if (!user) res.status(400).json({ message: 'User does not exist' });
        else if (!vendor) res.status(400).json({ message: 'Vendor does not exist' });
        else {
            console.log(req.body.items);
            console.log(user)
            console.log(vendor)
            res.status(200).json({ message: 'Order placed successfully' });
        }
    }

}, '@createItem ERROR: ');

const updateOrder = handler(async (req: Request, res: Response) => {
    const items: IItem[] = await Item.find({ vendor: req.query.vendorId }).populate('vendor');
    res.status(200).json(items);
}, '@readItemsByVendor ERROR: ');

const readOrdersByUser = handler(async (req: Request, res: Response) => {
    const items: IItem[] = await Item.find({ vendor: req.query.vendorId }).populate('vendor');
    res.status(200).json(items);
}, '@readItemsByVendor ERROR: ');

const readOrdersByVendor = handler(async (req: Request, res: Response) => {
    const items: IItem[] = await Item.find({ vendor: req.query.vendorId }).populate('vendor');
    res.status(200).json(items);
}, '@readItemsByVendor ERROR: ');


export { createOrder }