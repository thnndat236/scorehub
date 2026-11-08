/**
 * Response contracts for the ScoreHub API.
 *
 * Source of truth (checked manually):
 * - backend/src/dashboard/dashboard.service.ts
 * - backend/src/reports/reports.service.ts
 * - backend/src/student/student.service.ts
 * - backend/src/subjects/subjects.service.ts
 * - backend/src/health/health.controller.ts
 *
 * Keep this file in sync if the backend contracts change.
 */

export type HealthResponse = {
    status: string;
    database: string;
};

export type Subject = {
    code: string;
    name: string;
};

export type SubjectsResponse = {
    data: Subject[];
};

export type StudentScore = {
    subjectCode: string;
    subjectName: string;
    score: number;
};

export type StudentScoresResponse = {
    registrationNumber: string;
    foreignLanguageCode: string | null;
    subjectCount: number;
    averageScore: number | null;
    scores: StudentScore[];
};

export type SubjectStatistic = {
    subjectCode: string;
    subjectName: string;
    totalStudents: number;
    averageScore: number | null;
    highestScore: number | null;
    lowestScore: number | null;
};

export type SubjectStatisticsResponse = {
    data: SubjectStatistic[];
};

export type SubjectScoreDistribution = {
    subjectCode: string;
    subjectName: string;
    totalStudents: number;
    excellent: number;
    good: number;
    average: number;
    poor: number;
};

export type ScoreDistributionResponse = {
    data: SubjectScoreDistribution[];
};

export type HistogramBin = {
    label: string;
    lowerBound: number;
    upperBound: number;
    count: number;
};

export type HistogramResponse = {
    subjectCode: string;
    subjectName: string;
    totalStudents: number;
    bins: HistogramBin[];
};

export type OverviewResponse = {
    totalStudents: number;
    totalSubjects: number;
    validScoreRecords: number;
    overallAverageScore: number | null;
    studentsWithAverageAtLeast8: number;
    studentsWithAverageAtLeast8Rate: number; /* Fraction from 0 to 1, not a percentage. Multiply by 100 for display. */
};

export type ScoreLevel = "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR";

export type AverageLevel = {
    level: ScoreLevel;
    count: number;
    percentage: number; /* Percentage on a 0–100 scale. */
};

export type StudentAverageDistributionResponse = {
    totalStudents: number;
    levels: AverageLevel[];
};

export type TopGroupAStudent = {
    rank: number;
    registrationNumber: string;
    math: number;
    physics: number;
    chemistry: number;
    total: number;
};

export type TopGroupAResponse = {
    data: TopGroupAStudent[];
};
