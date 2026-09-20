import { PrismaClient } from "../generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

// Create a mystery case
const createCase = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            suspects,
            clues,
            solution
        } = req.body;

        const mysteryCase = await prisma.mysteryCase.create({
            data: {
                title,
                description,
                difficulty,
                suspects,
                clues,
                solution,
                createdById: req.user.userId,
            },
        });

        res.status(201).json({
            message: "Mystery case created successfully",
            mysteryCase,
        });

    } catch (error) {
        console.error("Create case error:", error);

        res.status(500).json({
            message: "Failed to create mystery case",
        });
    }
};

// Get all mystery cases
const getCases = async (req, res) => {
    try {
        const cases = await prisma.mysteryCase.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                suspects: true,
                clues: true,
                createdAt: true,
                createdById: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            cases,
        });

    } catch (error) {
        console.error("Get cases error:", error);

        res.status(500).json({
            message: "Failed to fetch mystery cases",
        });
    }
};

// Solve mystery case
const solveCase = async (req, res) => {
    try {
        const caseId = Number(req.params.id);
        const { suspect } = req.body;

        if (!suspect) {
            return res.status(400).json({
                message: "Suspect is required"
            });
        }

        const mysteryCase = await prisma.mysteryCase.findUnique({
            where: {
                id: caseId
            }
        });
        const existingAttempt = await prisma.caseAttempt.findFirst({
    where: {
        userId: req.user.userId,
        caseId: caseId
    }
});

if (existingAttempt) {
    return res.status(400).json({
        message: "You have already submitted an accusation for this case.",
        correct: existingAttempt.correct,
        score: existingAttempt.score
    });
}

        if (!mysteryCase) {
            return res.status(404).json({
                message: "Mystery case not found"
            });
        }

        // Check whether the selected suspect is correct
        const isCorrect = mysteryCase.solution
            .toLowerCase()
            .includes(suspect.toLowerCase());

        // Calculate score
        const score = isCorrect ? 100 : 0;

        // Save attempt
        await prisma.caseAttempt.create({
            data: {
                userId: req.user.userId,
                caseId: mysteryCase.id,
                suspect,
                correct: isCorrect,
                score
            }
        });

        // Send detailed result to frontend
        res.status(200).json({
            correct: isCorrect,
            score,
            suspect,
            caseId: mysteryCase.id,
            message: isCorrect
                ? "🎉 Case Solved! You identified the correct suspect."
                : "❌ Wrong Accusation! The selected suspect was not responsible."
        });

    } catch (error) {
        console.error("Solve case error:", error);

        res.status(500).json({
            message: "Failed to solve mystery case"
        });
    }
};

// Generate AI mystery case
const generateAICase = async (req, res) => {
    try {
        const { default: generateMystery } =
            await import("../services/aiService.js");

        // Ask AI to generate structured mystery
        const generatedCase = await generateMystery();

        // Save generated mystery to PostgreSQL
        const mysteryCase = await prisma.mysteryCase.create({
            data: {
                title: generatedCase.title,
                description: generatedCase.description,
                difficulty: generatedCase.difficulty,
                suspects: generatedCase.suspects,
                clues: generatedCase.clues,
                solution: generatedCase.solution,
                createdById: req.user.userId,
            },
        });

        // Do NOT send solution to frontend
        const {
            solution,
            ...safeCase
        } = mysteryCase;

        res.status(201).json({
            message: "AI mystery generated successfully",
            mysteryCase: safeCase,
        });

    } catch (error) {
        console.error("Generate AI case error:", error);

        res.status(500).json({
            message: "Failed to generate AI mystery"
        });
    }
};

// Get user's attempt history
const getMyAttempts = async (req, res) => {
    try {
        const attempts = await prisma.caseAttempt.findMany({
            where: {
                userId: req.user.userId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                mysteryCase: {
                    select: {
                        title: true,
                        difficulty: true
                    }
                }
            }
        });

        const totalScore = attempts.reduce(
            (sum, attempt) => sum + attempt.score,
            0
        );

        res.status(200).json({
            totalScore,
            totalAttempts: attempts.length,
            attempts
        });

    } catch (error) {
        console.error("Get attempts error:", error);

        res.status(500).json({
            message: "Failed to fetch case history"
        });
    }
};

// Export all controller functions
export {
    createCase,
    getCases,
    solveCase,
    generateAICase,
    getMyAttempts
};