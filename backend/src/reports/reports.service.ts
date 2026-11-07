import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type SubjectStatisticRow = {
    code: string;
    name: string;
    total_students: number;
    average_score: number | null;
    highest_score: number | null;
    lowest_score: number | null;
};

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

type ScoreDistributionRow = {
    code: string;
    name: string;
    total_students: number;
    excellent: number;
    good: number;
    average: number;
    poor: number;
};

type ScoreDistributionResponse = {
    data: Array<{
        subjectCode: string;
        subjectName: string;
        totalStudents: number;
        excellent: number;
        good: number;
        average: number;
        poor: number;
    }>
};

type HistogramRow = {
    bin: number;
    count: number;
};

type HistogramResponse = {
    subjectCode: string;
    subjectName: string;
    totalStudents: number;
    bins: Array<{
        label: string;
        lowerBound: number;
        upperBound: number;
        count: number;
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

    async getScoreDistribution(): Promise<ScoreDistributionResponse> {
        const rows = await this.prismaService.$queryRaw<ScoreDistributionRow[]>`
            SELECT
                s.code,
                s.name,
                COUNT(sc.student_id)::int AS total_students,
                COUNT(sc.student_id) FILTER (WHERE sc.score >= 8)::int AS excellent,
                COUNT(sc.student_id) FILTER (WHERE sc.score >= 6 AND sc.score < 8)::int AS good,
                COUNT(sc.student_id) FILTER (WHERE sc.score >= 4 AND sc.score < 6)::int AS average,
                COUNT(sc.student_id) FILTER (WHERE sc.score < 4)::int AS poor
            FROM subjects s
            LEFT JOIN student_scores sc ON s.id = sc.subject_id
            GROUP BY s.id, s.code, s.name
            ORDER BY s.id
        `

        return {
            data: rows.map((row) => ({
                subjectCode: row.code,
                subjectName: row.name,
                totalStudents: row.total_students,
                excellent: row.excellent,
                good: row.good,
                average: row.average,
                poor: row.poor
            }))
        };
    }

    async getHistogram(subjectCode: string): Promise<HistogramResponse> {
        const subject = await this.prismaService.subject.findUnique({
            where: { code: subjectCode },
            select: { id: true, code: true, name: true }
        });

        if (subject === null) {
            throw new NotFoundException(`Subject ${subjectCode} not found`);
        }
        
        const rows = await this.prismaService.$queryRaw<HistogramRow[]>`
            WITH bins AS (
                SELECT generate_series(0, 19) AS bin
            )
            SELECT
                b.bin::int AS bin,
                COUNT(sc.student_id)::int AS count
            FROM bins b
            LEFT JOIN student_scores sc
            ON sc.subject_id = ${subject.id}
            AND sc.score >= b.bin * 0.5
            AND (
                sc.score < (b.bin + 1) * 0.5
                OR (b.bin = 19 AND sc.score <= 10)
            )
            GROUP BY b.bin
            ORDER BY b.bin
        `;

        const bins = rows.map((row) => {
            const lowerBound = row.bin * 0.5;
            const upperBound = (row.bin + 1) * 0.5;

            return {
                label: row.bin === 19
                    ? "9.5-10"
                    : `${lowerBound}-<${upperBound}`,
                lowerBound,
                upperBound,
                count: row.count
            }
        });

        return {
            subjectCode: subject.code,
            subjectName: subject.name,
            totalStudents: bins.reduce((sum, bin) => sum + bin.count, 0),
            bins
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
