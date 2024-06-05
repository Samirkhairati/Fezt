import { Document, Schema, model } from 'mongoose';

export interface IVendor extends Document {
    _id: string;
    name?: string;
    email: string;
    image?: string;
    address?: string;
    phone?: string;
    password?: string;
}

const vendorSchema: Schema<IVendor> = new Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Vendor = model<IVendor>('Vendor', vendorSchema);

export default Vendor;