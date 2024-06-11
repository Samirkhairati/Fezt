import { Document, Schema, model } from 'mongoose';

export interface IVerify extends Document {
    _id: string;
    code: number;
    user?: string;
    vendor?: string;
}

const verifySchema: Schema<IVerify> = new Schema({
    code: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
    },
}, { timestamps: true });

const Verify = model<IVerify>('Verify', verifySchema);

export default Verify;