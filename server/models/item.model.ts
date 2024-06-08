import { Document, Schema, model } from 'mongoose';
import { IVendor } from './vendor.model';

export interface IItem extends Document {
    _id: string;
    name: string;
    image?: string;
    price?: number;
    vendor: string | Schema.Types.ObjectId | IVendor,
}

const itemSchema: Schema<IItem> = new Schema({
    name: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    }
}, { timestamps: true });

const Item = model<IItem>('Item', itemSchema);

export default Item;