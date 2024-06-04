// PACKAGES
import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
import path from 'path';

// UTILS
// import connectDB from './config/db.js';
// import userRoutes from './routes/userRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import uploadRoutes from "./routes/uploadRoutes.js";
// import orderRoutes from './routes/orderRoutes.js';
// import cloudinarySetup from './config/cloudinary.js';

// SETUP
// dotenv.config();
// connectDB();
// cloudinarySetup();
const app = express();
const location = path.resolve();

// MIDDLEWARE
app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors(
//     {
//         origin: true,
//         credentials: true,
//     }
// ));

// ROUTES
// app.use("/api/users", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/upload", uploadRoutes);

// BUILD
app.use(express.static(path.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(location, '../client/dist/index.html'));
});

// TEST
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
})

app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});