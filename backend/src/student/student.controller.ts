import { Controller, Get, Param } from "@nestjs/common";
import { StudentService } from "./student.service";
import { StudentRegistrationParamDto } from "./dto/student-registration-param.dto";

@Controller("students")
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get(":registrationNumber/scores")
    getScores(@Param() params: StudentRegistrationParamDto) {
        return this.studentService.getScores(params.registrationNumber);
    }
}