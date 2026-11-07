import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type SubjectStatisticRow = {
    code: string;
    name: string;
    total_students: number;
    average_score: number | null;
    highest_score: number | null;
    lowest_score: number | null;
}

type SubjectStatisticResponse = {
    data: Array<{
        subjectCode: string;
        subjectName: string;
        totalStudents: number;
        averageScore: number | null;
        highestScore: number | null;
        lowestScore: number | null;
    }>;
};


@Injectable()
export class ReportsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getSubjectStatistic(): Promise<SubjectStatisticResponse> {
        const rows = await this.prismaService.$queryRaw<SubjectStatisticRow[]>`
            SELECT
                s.code,
                s.name,
                COUNT(sc.student_id)::int AS total_students,
                AVG(sc.score)::float8 AS average_score,
                MAX(sc.score)::float8 AS highest_score,
                MIN(sc.score)::float8 AS lowest_score
            FROM subjects s
            LEFT JOIN student_scores sc ON s.id = sc.subject_id
            GROUP BY s.id, s.code, s.name
            ORDER BY s.id
        `;

        return {
            data: rows.map((row) => ({
                subjectCode: row.code,
                subjectName: row.name,
                totalStudents: row.total_students,
                averageScore: round(row.average_score, 4),
                highestScore: row.highest_score,
                lowestScore: row.lowest_score
            }))
        };
    }
}

function round(value: number | null, digits: number): number | null {
    if (value === null) {
        return null;
    }

    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}
