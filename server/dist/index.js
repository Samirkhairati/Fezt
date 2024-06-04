"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// PACKAGES ===============================
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongo_1 = __importDefault(require("./config/mongo"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const passport_1 = __importDefault(require("./config/passport"));
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// SETUP ===============================
const app = (0, express_1.default)();
const location = path_1.default.resolve();
dotenv_1.default.config();
(0, mongo_1.default)().catch(console.error);
// MIDDLEWARE ===============================
app.use(express_1.default.json());
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["fezt"],
    maxAge: 24 * 60 * 60 * 100,
}));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
console.log(process.env.CLIENT_ID);
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
}, function (accessToken, refreshToken, profile, callback) {
    callback(null, profile);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/auth", authRoutes_1.default);
// BUILD ===============================
app.use(express_1.default.static(path_1.default.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(location, '../client/dist/index.html'));
});
// TEST ===============================
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
});
app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});
