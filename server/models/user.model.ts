import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    name?: string;
    email: string;
    image?: string;
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
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;