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
            let total = 0;
            for (let item of req.body.items) {
                const populatedItem = await Item.findById(item._id).select('price');
                total += populatedItem?.price! * item.quantity;
            }
            user.balance! -= total;
            vendor.balance! += total;
            await user.save();
            await vendor.save();
            const order: IOrder = new Order({ vendor: req.body.vendor, user: req.body.user, items: req.body.items, stage: 1 });
            await order.save();
            const message = `Order Placed. ₹${total} has been deducted from your account. Current balance: ₹${user.balance}`
            res.status(200).json({ message });
        }
    }

}, '@createOrder ERROR: ');

const updateOrder = handler(async (req: any, res: Response) => {
    if (req.body.vendorId.toString() !== req.vendor._id.toString()) res.status(400).json({ message: 'You are not authorized to edit these orders' })
    else {
        console.log(req.body)
        const order: IOrder | null = await Order.findById(req.body.orderId);
        if (!order) res.status(400).json({ message: 'Order does not exist' });
        else {
            order.stage = req.body.stage;
            await order.save();
            res.json(order);
        }
    }
}, '@updateOrder ERROR: ');

const readOrdersByUser = handler(async (req: any, res: Response) => {
    if (req.query.userId.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to view these orders' })
    else {
        const orders: IOrder[] = await Order.find({ user: req.query.userId })
            .sort({ createdAt: -1 })
            .populate('vendor')
            .populate('items._id')
            .populate('user');
        res.json(orders);
    }
}, '@readItemsByUser ERROR: ');

const readOrdersByVendor = handler(async (req: any, res: Response) => {
    if (req.query.vendorId.toString() !== req.vendor._id.toString()) res.status(400).json({ message: 'You are not authorized to view these orders' })
    else {
        const orders: IOrder[] = await Order.find({ vendor: req.query.vendorId })
            .sort({ createdAt: -1 })
            .populate('vendor')
            .populate('items._id')
            .populate('user');
        res.json(orders);
    }
}, '@readItemsByVendor ERROR: ');


export { createOrder, readOrdersByUser, readOrdersByVendor, updateOrder }