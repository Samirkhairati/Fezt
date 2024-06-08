import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    name?: string;
    email: string;
    image?: string;
    phone?: string;
    address?: string;
    bits?: string;
    balance?: number;
    events?: string[];
}

const userSchema: Schema<IUser> = new Schema({
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
    bits: {
        type: String,
        required: false,
    },
    balance: {
        type: Number,
        required: false,
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }],
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;