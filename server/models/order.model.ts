import { IUser } from './user.model';
import { Document, Schema, model } from 'mongoose';
import { IVendor } from './vendor.model';

export interface IOrder extends Document {
    _id: string;
    user: string | Schema.Types.ObjectId | IUser,
    vendor: string | Schema.Types.ObjectId | IVendor,
    items: ItemData[],
}
export interface ItemData {
    _id: string,
    quantity: number,
}

const orderSchema: Schema<IOrder> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    items: [{ _id: String, quantity: Number}],
}, { timestamps: true });

const Order = model<IOrder>('Order', orderSchema);

export default Order;