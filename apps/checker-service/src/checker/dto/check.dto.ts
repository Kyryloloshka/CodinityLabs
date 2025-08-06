export class TestCaseDto {
  input: string;
  expected: string;
  description: string;
  isPublic?: boolean;
}

export class CheckDto {
  code: string;
  language?: string;
  assignmentId?: string;
  testCases: TestCaseDto[];
}
