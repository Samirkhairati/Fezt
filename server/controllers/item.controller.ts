import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Vendor, { IVendor } from "../models/vendor.model";
import Item, { IItem } from "../models/item.model";
//TODO: all controllers in if else instead of just if

const createItem = handler(async (req: any, res: Response) => {
    if (req.body.vendor.toString() !== req.vendor._id.toString()) res.status(400).json({ message: 'You are not authorized to create this item' })
    else {
        const newItem: IItem = new Item({
            name: req.body.name,
            image: req.body.image || 'https://semantic-ui.com/images/wireframe/image.png',
            price: req.body.price,
            vendor: req.body.vendor,
        });
        const createdItem = await newItem.save();
        res.json({
            name: createdItem.name,
            image: createdItem.image,
            price: createdItem.price,
            vendor: createdItem.vendor,
            _id: createdItem._id,
        })
    }

}, '@createItem ERROR: ');

const updateItem = handler(async (req: any, res: Response) => {
    const item: IItem | null = await Item.findOne({ _id: req.body._id });
    if (!item) res.status(400).json({ message: 'Item does not exist' });
    else {
        if (req.body.vendor.toString() !== req.vendor._id.toString()) res.status(400).json({ message: 'You are not authorized to edit this item' })
        item.name = req.body.name || item.name;
        item.image = req.body.image || item.image;
        item.price = req.body.price || item.price;
        await item.save();
        res.json({
            name: item.name,
            image: item.image,
            price: item.price,
            vendor: item.vendor,
            _id: item._id,
        })
    }

}, '@editItem ERROR: ');

const deleteItem = handler(async (req: any, res: Response) => {
    const item: IItem | null = await Item.findOne({ _id: req.query._id });
    if (!item) res.status(400).json({ message: 'Item does not exist' });
    else {
        if (req.query.vendor.toString() !== req.vendor._id.toString()) res.status(400).json({ message: 'You are not authorized to delete this item' })
        await Item.findByIdAndDelete(item._id);
        res.json({ message: 'Item deleted' });
    }
}, '@deleteIem ERROR: ')

const readItems = handler(async (req: Request, res: Response) => {
    const { page = 1, vendorId } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = 3;
    const items: IItem[] = await Item.find({ vendor: vendorId })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate('vendor');
    const totalCount = await Item.countDocuments({});
    const hasNextPage = pageNumber * limitNumber < totalCount;

    res.status(200).json({
        data: items,
        currentPage: pageNumber,
        nextPage: hasNextPage ? pageNumber + 1 : null,
    });
}, '@readItems ERROR: ');


const readItemsByVendor = handler(async (req: Request, res: Response) => {
    const items: IItem[] = await Item.find({ vendor: req.query.vendorId }).populate('vendor');
    res.status(200).json(items);
}, '@readItemsByVendor ERROR: ');


export { createItem, readItems, updateItem, deleteItem, readItemsByVendor }