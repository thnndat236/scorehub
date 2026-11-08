import "dotenv/config";
import path from "node:path";
import { parse } from "csv-parse";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createReadStream } from "node:fs";
import { parseScore } from "../src/common/domain/parse-score";

const CSV_PATH = path.join(__dirname, "..", "dataset", "diem_thi_thpt_2024.csv");

const BATCH_SIZE = 1000;

const EXPECTED_COLUMNS: readonly string[] = [
    "sbd",
    "toan",
    "ngu_van",
    "ngoai_ngu",
    "vat_li",
    "hoa_hoc",
    "sinh_hoc",
    "lich_su",
    "dia_li",
    "gdcd",
    "ma_ngoai_ngu"
];

const SCORE_COLUMNS: ReadonlyArray<{ column: string; code: string }> = [
    { column: "toan", code: "TOAN" },
    { column: "ngu_van", code: "NGU_VAN" },
    { column: "ngoai_ngu", code: "NGOAI_NGU" },
    { column: "vat_li", code: "VAT_LI" },
    { column: "hoa_hoc", code: "HOA_HOC" },
    { column: "sinh_hoc", code: "SINH_HOC" },
    { column: "lich_su", code: "LICH_SU" },
    { column: "dia_li", code: "DIA_LI" },
    { column: "gdcd", code: "GDCD" }
];

type ParsedStudent = {
    registrationNumber: string,
    foreignLanguageCode: string | null,
    scores: Array<{ code: string; score: number }>;
};

type Summary = {
    rowsRead: number;
    studentsInserted: number;
    duplicateStudents: number;
    scoresInserted: number;
    blankScoreCells: number;
    rejectedRows: number;
};

function validateHeader(record: Record<string, string>): void {
    const keys = Object.keys(record);
    const missing = EXPECTED_COLUMNS.filter((c) => !keys.includes(c));
    const extra = keys.filter((k) => !EXPECTED_COLUMNS.includes(k));

    if (missing.length > 0 || extra.length > 0) {
        throw new Error(
        `Unexpected CSV header. Missing: ${missing.join(', ') || "none"}. ` +
            `Extra: ${extra.join(', ') || "none"}.`
        );
    }
}

function parseRow(
    record: Record<string, string>,
    summary: Summary,
): ParsedStudent | null {
    const registrationNumber = (record.sbd ?? "").trim();
    if (registrationNumber === "") {
        summary.rejectedRows++;
        return null;
    }

    const foreignLanguageCode = (record.ma_ngoai_ngu ?? "").trim() || null;

    const scores: ParsedStudent["scores"] = [];

    for (const { column, code } of SCORE_COLUMNS) {
        const result = parseScore(record[column]);

        if (result.kind === "invalid") {
            summary.rejectedRows++;
            return null;
        }

        if (result.kind === "blank") {
            summary.blankScoreCells++;
            continue;
        }

        scores.push({ code, score: result.score.value });
    }

    return { registrationNumber, foreignLanguageCode, scores };
}

async function main(): Promise<void> {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    const prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString })
    });

    const summary: Summary = {
        rowsRead: 0,
        studentsInserted: 0,
        duplicateStudents: 0,
        scoresInserted: 0,
        blankScoreCells: 0,
        rejectedRows: 0
    };

    try {
        const subjects = await prisma.subject.findMany({
            select: { id: true, code: true }
        });

        const subjectIdByCode = new Map(
            subjects.map((s) => [s.code, s.id]),
        );

        for (const { code } of SCORE_COLUMNS) {
            if (!subjectIdByCode.has(code)) {
                throw new Error(`Missing subject ${code}. Run "prisma db seed" first.`);
            }
        }

        async function flushBatch(batch: ParsedStudent[]): Promise<void> {
            await prisma.$transaction(
                async (tx) => {
                    const createdStudents = await tx.student.createMany({
                        data: batch.map((row) => ({
                            registrationNumber: row.registrationNumber,
                            foreignLanguageCode: row.foreignLanguageCode
                        })),
                        skipDuplicates: true
                    });

                    const registrationNumbers = batch.map(
                        (row) => row.registrationNumber
                    );

                    const students = await tx.student.findMany({
                        where: { registrationNumber: { in: registrationNumbers } },
                        select: { id: true, registrationNumber: true }
                    });

                    const studentIdByRegistration = new Map(
                        students.map((s) => [s.registrationNumber, s.id])
                    );

                    const scoreRows: Array<{
                        studentId: number;
                        subjectId: number;
                        score: number;
                    }> = [];

                    for (const row of batch) {
                        const studentId = studentIdByRegistration.get(
                            row.registrationNumber
                        );
                        if (studentId === undefined) {
                            continue;
                        }

                        for (const score of row.scores) {
                            const subjectId = subjectIdByCode.get(score.code);
                            if (subjectId === undefined) {
                                continue;
                            }
                            scoreRows.push({
                                studentId,
                                subjectId,
                                score: score.score
                            });
                        }
                    }

                    const createdScores = await tx.studentScore.createMany({
                        data: scoreRows,
                        skipDuplicates: true
                    });

                    summary.studentsInserted += createdStudents.count;
                    summary.duplicateStudents += batch.length - createdStudents.count;
                    summary.scoresInserted += createdScores.count;
                },
                { timeout: 60_000 }
            );
        }

        const parser = createReadStream(CSV_PATH).pipe(
            parse({
                columns: true,
                bom: true,
                trim: true,
                skip_empty_lines: true
            })
        );

        let batch: ParsedStudent[] = [];
        let headerChecked = false;
        let batchesProcessed = 0;

        for await (const raw of parser) {
            const record = raw as Record<string, string>;

            if (!headerChecked) {
                validateHeader(record);
                headerChecked = true;
            }

            summary.rowsRead++;

            const parsed = parseRow(record, summary);
            if (parsed === null) {
                continue;
            }

            batch.push(parsed);

            if (batch.length >= BATCH_SIZE) {
                await flushBatch(batch);
                batch = [];
                batchesProcessed++;

                if (batchesProcessed % 20 === 0) {
                    console.log(
                        `Processed ${summary.rowsRead} rows, ` +
                        `${summary.scoresInserted} scores inserted...`
                    );
                }
            }
        }

        if (batch.length > 0) {
            await flushBatch(batch);
        }

        console.log("Import finished.");
        console.log(`Rows read: ${summary.rowsRead}`);
        console.log(`Students inserted: ${summary.studentsInserted}`);
        console.log(`Duplicate students: ${summary.duplicateStudents}`);
        console.log(`Scores inserted: ${summary.scoresInserted}`);
        console.log(`Blank score cells: ${summary.blankScoreCells}`);
        console.log(`Rejected rows: ${summary.rejectedRows}`);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
