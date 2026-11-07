import { Controller, Get, Param } from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller("students")
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get(":registrationNumber/scores")
    getScores(@Param("registrationNumber") registrationNumber: string) {
        return this.studentService.getScores(registrationNumber.trim());
    }
}