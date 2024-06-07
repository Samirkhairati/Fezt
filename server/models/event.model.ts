import { Document, Schema, model } from 'mongoose';
import { IClub } from './club.model';

export interface IEvent extends Document {
    _id: string;
    name: string;
    image?: string;
    price?: number;
    date?: string;
    registrations?: number;
    club: string | Schema.Types.ObjectId | IClub
}

const eventSchema: Schema<IEvent> = new Schema({
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
    date: {
        type: String,
        required: false,
    },
    registrations: {
        type: Number,
        required: false,
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
}, { timestamps: true });

const Event = model<IEvent>('Event', eventSchema);

export default Event;