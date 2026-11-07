import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const subjects = [
    { code: "TOAN", name: "Toán" },
    { code: "NGU_VAN", name: "Ngữ văn" },
    { code: 'NGOAI_NGU', name: 'Ngoại ngữ' },
    { code: 'VAT_LI', name: 'Vật lý' },
    { code: 'HOA_HOC', name: 'Hóa học' },
    { code: 'SINH_HOC', name: 'Sinh học' },
    { code: 'LICH_SU', name: 'Lịch sử' },
    { code: 'DIA_LI', name: 'Địa lý' },
    { code: 'GDCD', name: 'Giáo dục công dân' }
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