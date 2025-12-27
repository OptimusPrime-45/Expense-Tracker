import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/category.js";

dotenv.config({
    path: "./.env"
})

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

app.use('/api/', limiter);

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    })

    server.on("error", (error) => {
        console.log("Server error: ", error);
        throw error;
    })
})
.catch((error) => {
    console.log("MongoDB connection Failed: ", error);
})
