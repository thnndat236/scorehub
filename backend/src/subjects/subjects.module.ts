import { Module } from "@nestjs/common";
import { SubjectController } from "./subjects.controller";
import { SubjectsService } from "./subjects.service";

@Module({
    controllers: [SubjectController],
    providers: [SubjectsService]
})
export class SubjectsModule {}
