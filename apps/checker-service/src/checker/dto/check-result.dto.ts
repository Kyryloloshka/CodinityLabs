export class LintErrorDto {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
}

export class TestResultDto {
  passed: boolean;
  actual: string;
  expected: string;
  description: string;
  input: string;
}

export class CheckResultDto {
  lint: LintErrorDto[];
  tests: TestResultDto[];
  score: number;
}
