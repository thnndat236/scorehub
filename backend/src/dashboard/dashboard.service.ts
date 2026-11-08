import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type OverviewRow = {
    total_students: number;
    total_subjects: number;
    valid_score_records: number;
    overall_average_score: number | null;
    students_with_average_at_least_8: number;
};

type OverviewResponse = {
    totalStudents: number;
    totalSubjects: number;
    validScoreRecords: number;
    overallAverageScore: number | null;
    studentsWithAverageAtLeast8: number;
    studentsWithAverageAtLeast8Rate: number;
};

type AverageDistributionRow = {
    total_students: number;
    excellent: number;
    good: number;
    average: number;
    poor: number;
};

type AverageDistributionResponse = {
    totalStudents: number;
    levels: Array<{
        level: "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR";
        count: number;
        percentage: number;
    }>;
};

type TopGroupARow = {
    registration_number: string;
    math: number;
    physics: number;
    chemistry: number;
    total: number;
};

type TopGroupAResponse = {
    data: Array<{
        rank: number;
        registrationNumber: string;
        math: number;
        physics: number;
        chemistry: number;
        total: number;
    }>;      
};

@Injectable()
export class DashboardService {
    constructor(private readonly prismaService: PrismaService) {}

    async getOverview(): Promise<OverviewResponse> {
        const rows = await this.prismaService.$queryRaw<OverviewRow[]>`
            SELECT
                (SELECT COUNT(*) FROM students)::int AS total_students,
                (SELECT COUNT(*) FROM subjects)::int AS total_subjects,
                (SELECT COUNT(*) FROM student_scores)::int AS valid_score_records,
                (SELECT AVG(score) FROM student_scores)::float8 AS overall_average_score,
                (SELECT COUNT(*)::int 
                FROM (SELECT st.id
                    FROM students st
                    JOIN student_scores sc ON st.id = sc.student_id
                    GROUP BY st.id
                    HAVING AVG(sc.score) >= 8) students_above
                ) AS students_with_average_at_least_8
        `;

        const row = rows[0];

        return {
            totalStudents: row.total_students,
            totalSubjects: row.total_subjects,
            validScoreRecords: row.valid_score_records,
            overallAverageScore: roundNullable(row.overall_average_score, 4),
            studentsWithAverageAtLeast8: row.students_with_average_at_least_8,
            studentsWithAverageAtLeast8Rate: round(
                row.total_subjects === 0 ?
                0 : row.students_with_average_at_least_8 / row.total_students, 4
            )
        };
    }

    async getStudentAverageDistribution(): Promise<AverageDistributionResponse> {
        const rows = await this.prismaService.$queryRaw<AverageDistributionRow[]>`
            WITH student_averages AS (
                SELECT st.id, AVG(sc.score) AS average_score
                FROM students st
                JOIN student_scores sc ON st.id = sc.student_id
                GROUP BY st.id
            )
            SELECT
                COUNT(*)::int AS total_students,
                COUNT(*) FILTER (WHERE average_score >= 8)::int AS excellent,
                COUNT(*) FILTER (WHERE average_score >= 6 AND average_score < 8)::int AS good,
                COUNT(*) FILTER (WHERE average_score >= 4 AND average_score < 6)::int AS average,
                COUNT(*) FILTER (WHERE average_score < 4)::int AS poor
            FROM student_averages
        `;

        const row = rows[0];

        return {
            totalStudents: row.total_students,
            levels: [ 
                {
                    level: "EXCELLENT",
                    count: row.excellent,
                    percentage: percentage(row.excellent, row.total_students)
                },
                {
                    level: "GOOD",
                    count: row.good,
                    percentage: percentage(row.good, row.total_students)
                },
                {
                    level: "AVERAGE",
                    count: row.average,
                    percentage: percentage(row.average, row.total_students)
                },
                {
                    level: "POOR",
                    count: row.poor,
                    percentage: percentage(row.poor, row.total_students)
                }
            ]
        };
    }

    async getTopGroupA(): Promise<TopGroupAResponse> {
        const rows = await this.prismaService.$queryRaw<TopGroupARow[]>`
            SELECT
                st.registration_number,
                MAX(sc.score) FILTER (WHERE su.code = 'TOAN')::float8 AS math,
                MAX(sc.score) FILTER (WHERE su.code = 'VAT_LI')::float8 AS physics,
                MAX(sc.score) FILTER (WHERE su.code = 'HOA_HOC')::float8 AS chemistry,
                SUM(sc.score)::float8 AS total
            FROM students st
            JOIN student_scores sc ON st.id = sc.student_id
            JOIN subjects su ON su.id = sc.subject_id
            WHERE su.code IN ('TOAN', 'VAT_LI', 'HOA_HOC')
            GROUP BY st.id, st.registration_number
            HAVING COUNT(DISTINCT su.code) = 3
            ORDER BY total DESC, math DESC, physics DESC, chemistry DESC,
                    st.registration_number ASC
            LIMIT 10
        `;

        return {
            data: rows.map((row, index) => ({
                rank: index + 1,
                registrationNumber: row.registration_number,
                math: row.math,
                physics: row.physics,
                chemistry: row.chemistry,
                total: round(row.total, 2)
            }))
        };
    }

}

function round(value: number, digits: number): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}

function roundNullable(value: number | null, digits: number): number | null {
    return value === null ? null : round(value, digits);
}

function percentage(count: number, total: number): number {
    return total === 0 ? 0 : round((count / total) * 100, 2);
}
