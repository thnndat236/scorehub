import "server-only";

import { apiFetch } from "./client";
import type {
    HealthResponse,
    HistogramResponse,
    OverviewResponse,
    ScoreDistributionResponse,
    StudentAverageDistributionResponse,
    StudentScoresResponse,
    SubjectStatisticsResponse,
    SubjectsResponse,
    TopGroupAResponse
} from "./types";

export function getHealth(): Promise<HealthResponse> {
    return apiFetch<HealthResponse>("/health");
}

export function getSubjects(): Promise<SubjectsResponse> {
    return apiFetch<SubjectsResponse>("/subjects");
}

export function getStudentScores(registrationNumber: string): Promise<StudentScoresResponse> {
    return apiFetch<StudentScoresResponse>(`/students/${encodeURIComponent(registrationNumber)}/scores`);
}

export function getSubjectStatistics(): Promise<SubjectStatisticsResponse> {
    return apiFetch<SubjectStatisticsResponse>("/reports/subject-statistics");
}

export function getScoreDistribution(): Promise<ScoreDistributionResponse> {
    return apiFetch<ScoreDistributionResponse>("/reports/score-distribution");
}

export function getHistogram(subjectCode: string): Promise<HistogramResponse> {
    const params = new URLSearchParams({ subjectCode });
    return apiFetch<HistogramResponse>(`/reports/histogram?${params.toString()}`);
}

export function getOverview(): Promise<OverviewResponse> {
    return apiFetch<OverviewResponse>("/dashboard/overview");
}

export function getStudentAverageDistribution(): Promise<StudentAverageDistributionResponse> {
    return apiFetch<StudentAverageDistributionResponse>("/dashboard/student-average-distribution");
}

export function getTopGroupA(): Promise<TopGroupAResponse> {
    return apiFetch<TopGroupAResponse>("/dashboard/top-group-a");
}