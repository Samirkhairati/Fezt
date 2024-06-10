import { IUser } from './user.model';
import { Document, Schema, model } from 'mongoose';
import { IVendor } from './vendor.model';
import { IItem } from './item.model';

export interface IOrder extends Document {
    _id: string;
    user: string | Schema.Types.ObjectId | IUser,
    vendor: string | Schema.Types.ObjectId | IVendor,
    items: ItemData[],
    stage: number,
}
export interface ItemData {
    _id: string | Schema.Types.ObjectId | IItem,
    quantity: number,
}

const orderSchema: Schema<IOrder> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    stage: { type: Number, default: 0 },
    items: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Item' },
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true });

const Order = model<IOrder>('Order', orderSchema);

export default Order;