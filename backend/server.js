import "dotenv/config";
import connectDB from "./configs/db.js";
await connectDB();
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

const app = express();

import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";

const PORT = 4000;

// --------Middleware-------------
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
// --------------------------------------



// API Routes
app.get("/", (_, res) => {
	res.send("Server is Live!");
});
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () =>
	console.log(`Server is listening at http://localhost:${PORT}`)
);
