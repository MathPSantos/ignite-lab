import { CurrentUser, AuthUser } from './../../auth/current-user';
import { EnrollmentsService } from './../../../services/enrollments.service';
import { Enrollment } from './../models/enrollment';
import { AuthorizationGuard } from './../../auth/authorization.guard';
import { StudentsService } from './../../../services/students.service';
import { Query, ResolveField, Parent } from '@nestjs/graphql';
import { Student } from './../models/student';
import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Student)
export class StudentsResover {
  constructor(
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @Query(() => Student)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.studentsService.getStudentByAuthUserId(user.sub);
  }

  @Query(() => [Student])
  @UseGuards(AuthorizationGuard)
  students() {
    return this.studentsService.listAllStudents();
  }

  @ResolveField(() => [Enrollment])
  enrollments(@Parent() student: Student) {
    return this.enrollmentsService.listEnrollmentsByStudentId(student.id);
  }
}
