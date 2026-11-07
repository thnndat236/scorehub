import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type StudentScoreResponse = {
    registrationNumber: string;
    foreignLanguageCode: string | null;
    subjectCount: number;
    averageScore: number | null;
    scores: Array<{
        subjectCode: string;
        subjectName: string;
        score: number;
    }>;
}

@Injectable()
export class StudentService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getScores(registrationNumber: string): Promise<StudentScoreResponse> {
        const student = await this.prisma.student.findUnique({
            where: { registrationNumber },
            select: {
                registrationNumber: true,
                foreignLanguageCode: true,
                scores: {
                    select: {
                        score: true,
                        subject: {
                            select: { id: true, code: true, name: true }
                        }
                    },
                    orderBy: { subject: { id: "asc" } }
                }
            }
        });

        if (student === null) {
            throw new NotFoundException(`Student ${registrationNumber} not found`);
        }

        const scores = student.scores.map((row) => ({
            subjectCode: row.subject.code,
            subjectName: row.subject.name,
            score: Number(row.score)
        }));

        const averageScore = scores.length == 0 ? null : Math.round((scores.reduce((sum, row) => sum + row.score, 0) / scores.length) * 10000) / 10000;

        return {
            registrationNumber: student.registrationNumber,
            foreignLanguageCode: student.foreignLanguageCode,
            subjectCount: scores.length,
            averageScore,
            scores
        };
    }
}