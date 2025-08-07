export class TestCaseDto {
  input: string;
  expected: string;
  description: string;
  isPublic?: boolean;
}

export class CheckSettingsDto {
  timeout?: number = 2000; // Таймаут в мілісекундах
  maxAttempts?: number | null = null; // Максимальна кількість спроб (null = необмежено)
  passingThreshold?: number = 80.0; // Поріг проходження тесту в відсотках
  allowPartialScore?: boolean = true; // Дозволити часткові бали
  strictMode?: boolean = false; // Строгий режим (всі тести мають пройти)
}

export class CheckDto {
  code: string;
  language?: string;
  assignmentId?: string;
  testCases: TestCaseDto[];
  settings?: CheckSettingsDto;
}
