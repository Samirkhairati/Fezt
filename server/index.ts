// PACKAGES ====================================================================================
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import mongo from './config/mongo.config';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { Redis } from 'ioredis';
// HANDLERS ====================================================================================
import userRoutes from './routes/user.routes';
import vendorRoutes from './routes/vendor.routes';
import clubRoutes from './routes/club.routes';
import eventRoutes from './routes/events.routes';
import itemRoutes from './routes/items.routes';
import orderRoutes from './routes/order.routes';
import mailRoutes from './routes/mail.routes';
// SETUP ====================================================================================
dotenv.config();
mongo()
const app = express();
const location = path.resolve();
// FIREBASE ====================================================================================
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
export default admin
// MAIL ====================================================================================
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
});
// REDIS ====================================================================================
export const redis = new Redis(process.env.REDIS!);
// MIDDLEWARE ====================================================================================
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: true,
        credentials: true,
    }
));
// ROUTES ====================================================================================
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mails", mailRoutes);
// BUILD ====================================================================================
app.use(express.static(path.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(location, '../client/dist/index.html'));
});
// TEST ====================================================================================
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
})
app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});