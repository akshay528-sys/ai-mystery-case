import { PrismaClient } from "../generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import Groq from "groq-sdk";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const askSuspect = async (req, res) => {
    try {
        const { caseId, suspect, question } = req.body;

        if (!caseId || !suspect || !question) {
            return res.status(400).json({
                message: "caseId, suspect and question are required",
            });
        }

        const mysteryCase = await prisma.mysteryCase.findUnique({
            where: {
                id: Number(caseId),
            },
        });

        if (!mysteryCase) {
            return res.status(404).json({
                message: "Mystery case not found",
            });
        }

        const prompt = `
You are roleplaying as a suspect in a mystery investigation.

Mystery:
${mysteryCase.description}

Suspects:
${JSON.stringify(mysteryCase.suspects)}

Clues:
${JSON.stringify(mysteryCase.clues)}

Actual solution:
${mysteryCase.solution}

You are:
${suspect}

Detective's question:
${question}

Rules:
- Stay in character as the suspect.
- Answer naturally and briefly.
- Do not reveal the actual solution directly.
- Do not say that you are an AI.
- You may lie, evade, or reveal partial information.
- Keep your answers consistent with the mystery.
`;

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are a mystery suspect being interrogated.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
        });

        const answer = completion.choices[0].message.content;

        const interrogation = await prisma.interrogation.create({
            data: {
                userId: req.user.userId,
                caseId: Number(caseId),
                suspect,
                question,
                answer,
            },
        });

        res.status(200).json({
            message: "Suspect answered successfully",
            answer,
            interrogationId: interrogation.id,
        });

    } catch (error) {
        console.error("Interrogation error:", error);

        res.status(500).json({
            message: "Failed to interrogate suspect",
        });
    }
};

const getInterrogations = async (req, res) => {
    try {
        const { caseId } = req.params;

        const interrogations = await prisma.interrogation.findMany({
            where: {
                caseId: Number(caseId),
                userId: req.user.userId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        res.status(200).json({
            interrogations,
        });

    } catch (error) {
        console.error("Failed to fetch interrogations:", error);

        res.status(500).json({
            message: "Failed to fetch interrogation history",
        });
    }
};

export {
    askSuspect,
    getInterrogations,
};