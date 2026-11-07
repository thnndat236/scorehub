import { IsNotEmpty, IsString } from "class-validator";
export class HistogramQueryDto {
    @IsString()
    @IsNotEmpty()
    subjectCode: string;
}
