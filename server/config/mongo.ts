
import mongoose from 'mongoose';

const clientOptions: mongoose.ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export default async function mongo() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(process.env.MONGO!, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("🌱🌱🌱 You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
