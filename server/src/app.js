import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";

const app = express();
const vercelEnvironment = process.env.VERCEL_ENV;
const useConfiguredOrigin =
    process.env.NODE_ENV === "production" ||
    (Boolean(vercelEnvironment) && vercelEnvironment !== "development");
const frontendUrl = process.env.FRONTEND_URL?.trim();

if (useConfiguredOrigin && !frontendUrl) {
    throw new Error("FRONTEND_URL must be configured for this deployment");
}

const frontendOrigin = frontendUrl
    ? new URL(frontendUrl).origin
    : null;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, false);
        }

        const isAllowed = useConfiguredOrigin
            ? origin === frontendOrigin
            : /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);

        return callback(null, isAllowed);
    }
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        message: "Mystery API is running"
    });
});

export default app;
