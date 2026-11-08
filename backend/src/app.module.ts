import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { StudentModule } from './student/student.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [ConfigModule.forRoot({ 
    isGlobal: true,
    envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    HealthModule,
    StudentModule,
    ReportsModule,
    DashboardModule,
    SubjectsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
