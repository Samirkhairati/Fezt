// PACKAGES ==========================================
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import mongo from './config/mongo.config';

// UTILS ==========================================
import userRoutes from './routes/user.routes';
import vendorRoutes from './routes/vendor.routes';
import clubRoutes from './routes/club.routes';

// SETUP ==========================================
dotenv.config();
mongo()
const app = express();
const location = path.resolve();

// MIDDLEWARE ==========================================
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: true,
        credentials: true,
    }
));

// ROUTES ==========================================
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/clubs", clubRoutes);

// BUILD ==========================================
app.use(express.static(path.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(location, '../client/dist/index.html'));
});

// TEST ==========================================
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
})

app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});