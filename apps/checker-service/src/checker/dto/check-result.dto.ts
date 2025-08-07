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
  timeout?: boolean; // Додаємо поле для відстеження таймауту
}

export class CheckSettingsDto {
  timeout: number;
  maxAttempts: number | null; // null = необмежено
  passingThreshold: number;
  allowPartialScore: boolean;
  strictMode: boolean;
}

export class CheckResultDto {
  lint: LintErrorDto[];
  tests: TestResultDto[];
  score: number;
  testStats: {
    total: number;
    passed: number;
    failed: number;
    timeout: number;
    public: number;
  };
  passedThreshold: boolean; // Чи пройшов поріг проходження
  settings: CheckSettingsDto; // Використані налаштування
}
