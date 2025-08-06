export class TestCaseDto {
  input: string;
  expected: string;
  description: string;
}

export class CheckDto {
  code: string;
  language?: string;
  assignmentId?: string;
  testCases: TestCaseDto[];
}
