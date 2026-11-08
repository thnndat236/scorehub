import { IsString, Matches } from "class-validator";

export class StudentRegistrationParamDto {
    @IsString()
    @Matches(/^\d{8}$/, {
        message: "registrationNumber must be exactly 8 digits"
    })
    registrationNumber: string;
}
