import { PrismaClient } from "../generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientKey = "__aiMysteryCasePrisma";

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL must be configured");
    }

    const adapter = new PrismaPg({ connectionString });

    return new PrismaClient({ adapter });
};

const prisma =
    globalThis[prismaClientKey] ?? createPrismaClient();

globalThis[prismaClientKey] = prisma;

export default prisma;
