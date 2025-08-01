import { Injectable } from '@nestjs/common';
import { CheckDto, TestCaseDto } from './dto/check.dto';
import {
  CheckResultDto,
  LintErrorDto,
  TestResultDto,
} from './dto/check-result.dto';

@Injectable()
export class CheckerService {
  constructor() {}

  checkCode(checkDto: CheckDto): CheckResultDto {
    const { code, testCases } = checkDto;

    // Базова перевірка коду
    const lintResults = this.runLintAnalysis(code);

    // Виконання тестів
    const testResults = this.runTests(code, testCases);

    // Розрахунок score
    const score = this.calculateScore(lintResults, testResults);

    return {
      lint: lintResults,
      tests: testResults,
      score,
    };
  }

  private runLintAnalysis(code: string): LintErrorDto[] {
    const lintErrors: LintErrorDto[] = [];

    try {
      // Базова перевірка на наявність функції main
      if (
        !code.includes('function main') &&
        !code.includes('const main') &&
        !code.includes('let main')
      ) {
        lintErrors.push({
          ruleId: 'missing-main-function',
          severity: 2,
          message: 'Function main is required',
          line: 1,
          column: 1,
        });
      }

      // Перевірка на базові синтаксичні помилки
      try {
        // Використовуємо безпечніший спосіб перевірки синтаксису
        this.validateSyntax(code);
      } catch (syntaxError) {
        lintErrors.push({
          ruleId: 'syntax-error',
          severity: 2,
          message: `Syntax error: ${(syntaxError as Error).message}`,
          line: 1,
          column: 1,
        });
      }
    } catch (error) {
      console.error('Lint analysis error:', error);
    }

    return lintErrors;
  }

  private validateSyntax(code: string): void {
    // Базова перевірка синтаксису без використання eval
    const basicChecks = [
      { pattern: /function\s+\w+\s*\(/, name: 'function declaration' },
      { pattern: /const\s+\w+\s*=/, name: 'const declaration' },
      { pattern: /let\s+\w+\s*=/, name: 'let declaration' },
      { pattern: /var\s+\w+\s*=/, name: 'var declaration' },
    ];

    // Перевіряємо базові конструкції
    const hasValidConstructs = basicChecks.some((check) =>
      check.pattern.test(code),
    );

    if (!hasValidConstructs) {
      throw new Error('Invalid JavaScript syntax');
    }
  }

  private runTests(code: string, testCases: TestCaseDto[]): TestResultDto[] {
    const results: TestResultDto[] = [];

    for (const testCase of testCases) {
      try {
        const result = this.runSingleTest(code, testCase);
        results.push(result);
      } catch (error) {
        console.error('Test execution error:', error);
        results.push({
          passed: false,
          actual:
            'Error: ' +
            (error instanceof Error ? error.message : String(error)),
          expected: testCase.expected,
          description: testCase.description,
          input: testCase.input,
        });
      }
    }

    return results;
  }

  private runSingleTest(code: string, testCase: TestCaseDto): TestResultDto {
    try {
      // Створюємо безпечну функцію для виконання коду
      const safeCode = this.createSafeExecutionCode(code, testCase.input);
      const actual = this.executeCodeSafely(safeCode);
      const actualString = String(actual);
      const passed = actualString === testCase.expected;

      return {
        passed,
        actual: actualString,
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
      };
    } catch (error) {
      return {
        passed: false,
        actual:
          'Error: ' + (error instanceof Error ? error.message : String(error)),
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
      };
    }
  }

  private createSafeExecutionCode(code: string, input: unknown): string {
    return `
      ${code}
      
      // Перевіряємо, чи існує функція main
      if (typeof main !== 'function') {
        throw new Error('Function main is not defined');
      }
      
      // Виконуємо функцію з вхідними даними
      return main(${JSON.stringify(input)});
    `;
  }

  private executeCodeSafely(code: string): unknown {
    // В реальному проекті тут можна використовувати більш безпечні альтернативи
    // наприклад, використання VM модуля Node.js або інших sandbox рішень
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const executeCode = new Function(code) as () => unknown;
      return executeCode();
    } catch (error) {
      throw new Error(
        `Code execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private calculateScore(
    lintErrors: LintErrorDto[],
    testResults: TestResultDto[],
  ): number {
    if (testResults.length === 0) {
      return 0;
    }

    // Базовий score на основі пройдених тестів (70% від загального score)
    const passedTests = testResults.filter((test) => test.passed).length;
    const testScore = (passedTests / testResults.length) * 70;

    // Штраф за помилки коду (30% від загального score)
    const errorCount = lintErrors.filter(
      (error) => error.severity === 2,
    ).length;
    const warningCount = lintErrors.filter(
      (error) => error.severity === 1,
    ).length;

    // Максимальний штраф 30 балів
    const lintPenalty = Math.min(30, errorCount * 3 + warningCount * 1);
    const lintScore = Math.max(0, 30 - lintPenalty);

    return Math.round(testScore + lintScore);
  }
}
