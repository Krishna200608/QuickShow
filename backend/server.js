import "dotenv/config";
import connectDB from "./configs/db.js";
await connectDB();

import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";

const app = express();
const PORT = 4000;
import { inngest, functions } from "./inngest/index.js"

// Middleware

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

// API Routes
app.get("/", (_, res) => {
	res.send("Server is Live!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () =>
	console.log(`Server is listening at http://localhost:${PORT}`)
);
