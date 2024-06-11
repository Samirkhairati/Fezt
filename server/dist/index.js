"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
// PACKAGES ====================================================================================
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongo_config_1 = __importDefault(require("./config/mongo.config"));
const admin = __importStar(require("firebase-admin"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// HANDLERS ====================================================================================
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const vendor_routes_1 = __importDefault(require("./routes/vendor.routes"));
const club_routes_1 = __importDefault(require("./routes/club.routes"));
const events_routes_1 = __importDefault(require("./routes/events.routes"));
const items_routes_1 = __importDefault(require("./routes/items.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const mail_routes_1 = __importDefault(require("./routes/mail.routes"));
// SETUP ====================================================================================
dotenv_1.default.config();
(0, mongo_config_1.default)();
const app = (0, express_1.default)();
const location = path_1.default.resolve();
// FIREBASE ====================================================================================
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.default = admin;
// MAIL ====================================================================================
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
});
// MIDDLEWARE ====================================================================================
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
// ROUTES ====================================================================================
app.use("/api/users", user_routes_1.default);
app.use("/api/vendors", vendor_routes_1.default);
app.use("/api/clubs", club_routes_1.default);
app.use("/api/events", events_routes_1.default);
app.use("/api/items", items_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/mails", mail_routes_1.default);
// BUILD ====================================================================================
app.use(express_1.default.static(path_1.default.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(location, '../client/dist/index.html'));
});
// TEST ====================================================================================
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
});
app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});
console.log(process.env.MAIL_EMAIL);
