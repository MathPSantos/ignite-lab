import { DatabaseModule } from './../database/database.module';
import { EnrollmentsService } from './../services/enrollments.service';
import { CoursesService } from './../services/courses.service';
import { StudentsService } from './../services/students.service';
import { PurchaseController } from './controllers/purchases.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [PurchaseController],
  providers: [StudentsService, CoursesService, EnrollmentsService],
})
export class MessagingModule {}
