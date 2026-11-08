import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const subjects = [
    { code: "TOAN", name: "Mathematics" },
    { code: "NGU_VAN", name: "Literature" },
    { code: 'NGOAI_NGU', name: 'Foreign Language' },
    { code: 'VAT_LI', name: 'Physics' },
    { code: 'HOA_HOC', name: 'Chemistry' },
    { code: 'SINH_HOC', name: 'Biology' },
    { code: 'LICH_SU', name: 'History' },
    { code: 'DIA_LI', name: 'Geography' },
    { code: 'GDCD', name: 'Civic Education' }
];

async function main(): Promise<void> {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    const prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString })
    });

    try {
        for (const subject of subjects) {
            await prisma.subject.upsert({
                where: { code: subject.code },
                update: { name: subject.name },
                create: subject
            });
        }
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});