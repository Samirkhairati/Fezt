
import mongoose, { ConnectOptions } from 'mongoose';
const clientOptions: ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export default async function mongo() {
    try {
        await mongoose.connect(process.env.MONGO!, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("🌱🌱🌱 You successfully connected to MongoDB!");
    }
    catch {
        console.log("❌❌❌ Couldn't connect to MongoDB!");
    }
}