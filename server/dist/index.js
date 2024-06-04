"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// PACKAGES ==========================================
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongo_config_1 = __importDefault(require("./config/mongo.config"));
// UTILS ==========================================
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// import categoryRoutes from './routes/categoryRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import uploadRoutes from "./routes/uploadRoutes.js";
// import orderRoutes from './routes/orderRoutes.js';
// import cloudinarySetup from './config/cloudinary.js';
// SETUP ==========================================
dotenv_1.default.config();
(0, mongo_config_1.default)();
const app = (0, express_1.default)();
const location = path_1.default.resolve();
// MIDDLEWARE ==========================================
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
// ROUTES ==========================================
app.use("/api/users", user_routes_1.default);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/upload", uploadRoutes);
// BUILD ==========================================
app.use(express_1.default.static(path_1.default.join(location, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(location, '../client/dist/index.html'));
});
// TEST ==========================================
app.get('/', (req, res) => {
    res.send(`API is running on port ${process.env.PORT}...`);
});
app.listen(process.env.PORT || 6969, () => {
    console.log(`Server running on port ${process.env.PORT || 6969}`);
});
