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
    const { code, testCases, language = 'javascript' } = checkDto;

    // Базова перевірка коду з урахуванням мови програмування
    const lintResults = this.runLintAnalysis(code, language);

    // Виконання тестів
    const testResults = this.runTests(code, testCases, language);

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

  private runTests(
    code: string,
    testCases: TestCaseDto[],
    language: string,
  ): TestResultDto[] {
    const results: TestResultDto[] = [];

    for (const testCase of testCases) {
      try {
        const result = this.runSingleTest(code, testCase, language);
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

  private runSingleTest(
    code: string,
    testCase: TestCaseDto,
    language: string,
  ): TestResultDto {
    try {
      const safeCode = this.createSafeExecutionCode(
        code,
        testCase.input,
        language,
      );
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

  private createSafeExecutionCode(
    code: string,
    input: unknown,
    language: string,
  ): string {
    let processedCode = code;
    if (language === 'typescript') {
      processedCode = this.removeTypeScriptTypes(code);
    }

    return `
      ${processedCode}
      
      if (typeof main !== 'function' && typeof solution !== 'function') {
        throw new Error('Function main or solution is not defined');
      }
      
      const func = typeof main === 'function' ? main : solution;
      return func(${JSON.stringify(input)});
    `;
  }

  private removeTypeScriptTypes(code: string): string {
    let result = code;

    // Видаляємо типи параметрів функцій
    result = result.replace(/:\s*[a-zA-Z<>[\]()|&, \s]+(?=\s*[,)])/g, '');

    // Видаляємо типи змінних
    result = result.replace(
      /const\s+(\w+):\s*[a-zA-Z<>[\]()|&, \s]+/g,
      'const $1',
    );
    result = result.replace(/let\s+(\w+):\s*[a-zA-Z<>[\]()|&, \s]+/g, 'let $1');
    result = result.replace(/var\s+(\w+):\s*[a-zA-Z<>[\]()|&, \s]+/g, 'var $1');

    // Видаляємо return типи функцій
    result = result.replace(
      /function\s+(\w+)\s*\([^)]*\)\s*:\s*[a-zA-Z<>[\]()|&, \s]+/g,
      (match) => {
        return match.replace(/:\s*[a-zA-Z<>[\]()|&, \s]+$/, '');
      },
    );

    // Видаляємо interface та type declarations
    result = result.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
    result = result.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');

    // Видаляємо import statements
    result = result.replace(/import\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');

    // Видаляємо export statements
    result = result.replace(/export\s+/g, '');

    // Видаляємо залишкові типи
    result = result.replace(/:\s*[a-zA-Z<>[\]()|&, \s]+/g, '');

    return result;
  }

  private executeCodeSafely(code: string): unknown {
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
