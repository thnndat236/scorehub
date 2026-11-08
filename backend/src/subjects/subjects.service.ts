import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type SubjectsResponse = {
    data: Array<{
        code: string,
        name: string
    }>;
};

@Injectable()
export class SubjectsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(): Promise<SubjectsResponse> {
        const rows = await this.prismaService.subject.findMany({
            select: { code: true, name: true },
            orderBy: { id: "asc" }
        });

        return { data: rows };
    }
}
