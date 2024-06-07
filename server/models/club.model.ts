import { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';

export interface IClub extends Document {
    _id: string;
    name: string;
    revenue?: number;
    user: string | Schema.Types.ObjectId | IUser
}

const clubSchema: Schema<IClub> = new Schema({
    name: {
        type: String,
        required: false,
    },
    revenue: {
        type: Number,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Club = model<IClub>('Club', clubSchema);

export default Club;