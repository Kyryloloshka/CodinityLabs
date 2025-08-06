import { Injectable } from '@nestjs/common';
import { CheckDto, TestCaseDto } from './dto/check.dto';
import {
  CheckResultDto,
  LintErrorDto,
  TestResultDto,
} from './dto/check-result.dto';
import { SafeCodeExecutorService } from './safe-code-executor.service';

@Injectable()
export class CheckerService {
  constructor(
    private readonly safeCodeExecutorService: SafeCodeExecutorService,
  ) {}

  async checkCode(checkDto: CheckDto): Promise<CheckResultDto> {
    const { code, testCases, language = 'javascript' } = checkDto;

    // Базова перевірка коду з урахуванням мови програмування
    const lintResults = this.runLintAnalysis(code, language);

    // Виконання тестів в безпечному середовищі
    const testResults = await this.runTestsSafely(code, testCases, language);

    // Розрахунок score
    const score = this.calculateScore(lintResults, testResults);

    return {
      lint: lintResults,
      tests: testResults,
      score,
    };
  }

  private runLintAnalysis(code: string, language: string): LintErrorDto[] {
    const lintErrors: LintErrorDto[] = [];

    try {
      // Перевірка на основі мови програмування
      switch (language) {
        case 'javascript':
        case 'typescript':
          this.checkJavaScriptSyntax(code, lintErrors);
          break;
        default:
          this.checkJavaScriptSyntax(code, lintErrors);
      }
    } catch (error) {
      console.error('Lint analysis error:', error);
    }

    return lintErrors;
  }

  private checkJavaScriptSyntax(
    code: string,
    lintErrors: LintErrorDto[],
  ): void {
    // Перевірка на наявність функції main або solution
    if (
      !code.includes('function main') &&
      !code.includes('const main') &&
      !code.includes('let main') &&
      !code.includes('function solution') &&
      !code.includes('const solution') &&
      !code.includes('let solution')
    ) {
      lintErrors.push({
        ruleId: 'missing-main-function',
        severity: 2,
        message: 'Function main or solution is required',
        line: 1,
        column: 1,
      });
    }

    // Базова перевірка синтаксису
    try {
      this.validateJavaScriptSyntax(code);
    } catch (syntaxError) {
      lintErrors.push({
        ruleId: 'syntax-error',
        severity: 2,
        message: `Syntax error: ${(syntaxError as Error).message}`,
        line: 1,
        column: 1,
      });
    }
  }

  private validateJavaScriptSyntax(code: string): void {
    const basicChecks = [
      { pattern: /function\s+\w+\s*\(/, name: 'function declaration' },
      { pattern: /const\s+\w+\s*=/, name: 'const declaration' },
      { pattern: /let\s+\w+\s*=/, name: 'let declaration' },
      { pattern: /var\s+\w+\s*=/, name: 'var declaration' },
    ];

    const hasValidConstructs = basicChecks.some((check) =>
      check.pattern.test(code),
    );

    if (!hasValidConstructs) {
      throw new Error('Invalid JavaScript syntax');
    }
  }

  private async runTestsSafely(
    code: string,
    testCases: TestCaseDto[],
    language: string,
  ): Promise<TestResultDto[]> {
    const results: TestResultDto[] = [];

    // Виконуємо тести послідовно в безпечному середовищі
    for (const testCase of testCases) {
      try {
        const result = await this.safeCodeExecutorService.executeCodeSafely(
          code,
          testCase,
          language,
          1000, // 1 секунда таймаут
        );
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
          timeout: false,
        });
      }
    }

    return results;
  }

  private calculateScore(
    lintErrors: LintErrorDto[],
    testResults: TestResultDto[],
  ): number {
    if (testResults.length === 0) {
      return 0;
    }

    const passedTests = testResults.filter((test) => test.passed).length;
    const testScore = (passedTests / testResults.length) * 70;

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
