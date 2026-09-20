import express from "express";

import {
    askSuspect,
    getInterrogations
} from "../controllers/interrogationController.js";

import {
    createCase,
    getCases,
    solveCase,
    generateAICase,
    getMyAttempts
} from "../controllers/caseController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import generateMystery from "../services/aiService.js";

const router = express.Router();


// ===============================
// AI Mystery Case
// ===============================

router.post(
    "/generate",
    authMiddleware,
    generateAICase
);

router.post(
    "/",
    authMiddleware,
    createCase
);

router.get(
    "/",
    authMiddleware,
    getCases
);


// ===============================
// AI Suspect Interrogation
// ===============================

router.post(
    "/interrogate",
    authMiddleware,
    askSuspect
);


// Get interrogation history
router.get(
    "/interrogations/:caseId",
    authMiddleware,
    getInterrogations
);





// ===============================
// Solve Mystery
// ===============================

router.post(
    "/:id/solve",
    authMiddleware,
    solveCase
);


// ===============================
// Attempt History
// ===============================

router.get(
    "/attempts",
    authMiddleware,
    getMyAttempts
);


// ===============================
// AI Test
// ===============================

router.get(
    "/ai-test",
    authMiddleware,
    async (req, res) => {
        try {
            const mystery = await generateMystery();

            res.json({
                message: "AI is working!",
                mystery
            });

        } catch (error) {
            console.error(
                "AI test error:",
                error
            );

            res.status(500).json({
                message: "AI generation failed"
            });
        }
    }
);


export default router;