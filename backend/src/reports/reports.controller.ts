import { Controller, Get } from "@nestjs/common";
import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get("subject-statistics")
    getSubjectStatistic() {
        return this.reportsService.getSubjectStatistic();
    }

    @Get("score-distribution")
    getScoreDistribution() {
        return this.reportsService.getScoreDistribution();
    }
}