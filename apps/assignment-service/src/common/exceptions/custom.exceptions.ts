import { HttpException, HttpStatus } from '@nestjs/common';

export class AssignmentNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Assignment with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class SubmissionNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Submission with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class TestCaseNotFoundException extends HttpException {
  constructor(id: string) {
    super(`TestCase with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
