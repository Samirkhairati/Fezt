// PACKAGES ===============================
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongo from './config/mongo';
import cookieSession from 'cookie-session';
import authRoutes from './routes/authRoutes';
import passport from "./config/passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;



// SETUP ===============================
const app = express();
const location = path.resolve();
dotenv.config();
mongo().catch(console.error);

// MIDDLEWARE ===============================
app.use(express.json());
app.use(
    cookieSession({
        name: "session",
        keys: ["fezt"],
        maxAge: 24 * 60 * 60 * 100,
    })
); app.use(cors(
    {
        origin: true,
        credentials: true
    }
));

console.log(process.env.CLIENT_ID);
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        function (accessToken: any, refreshToken: any, profile: any, callback: any) {
            callback(null, profile);
        }
    )
);

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());



app.use("/auth", authRoutes);


// BUILD ===============================
app.use(express.static(path.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(location, '../client/dist/index.html'));
});

// TEST ===============================
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
})
app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});