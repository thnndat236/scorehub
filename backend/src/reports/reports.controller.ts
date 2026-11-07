import { Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { HistogramQueryDto } from "./dto/histogram-query.dto";

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

    @Get("histogram")
    getHistogram(@Query() query: HistogramQueryDto) {
        return this.reportsService.getHistogram(query.subjectCode);
    }
}