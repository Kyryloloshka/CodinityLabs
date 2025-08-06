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

    const lintResults = this.runLintAnalysis(code, language);

    const allTestResults = await this.runTestsSafely(code, testCases, language);

    const publicTestResults = allTestResults.filter(
      (_, index) => testCases[index]?.isPublic !== false,
    );

    const testStats = this.calculateTestStats(allTestResults, testCases);

    const score = this.calculateScore(lintResults, allTestResults);

    return {
      lint: lintResults,
      tests: publicTestResults,
      score,
      testStats,
    };
  }

  private runLintAnalysis(code: string, language: string): LintErrorDto[] {
    const lintErrors: LintErrorDto[] = [];

    try {
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

    for (const testCase of testCases) {
      try {
        const result = await this.safeCodeExecutorService.executeCodeSafely(
          code,
          testCase,
          language,
          1000,
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

    const lintPenalty = Math.min(30, errorCount * 3 + warningCount * 1);
    const lintScore = Math.max(0, 30 - lintPenalty);

    return Math.round(testScore + lintScore);
  }

  private calculateTestStats(
    allTestResults: TestResultDto[],
    testCases: TestCaseDto[],
  ): {
    total: number;
    passed: number;
    failed: number;
    timeout: number;
    public: number;
  } {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let timeout = 0;
    let publicCount = 0;

    for (let i = 0; i < allTestResults.length; i++) {
      const testResult = allTestResults[i];
      const testCase = testCases[i];

      total++;
      if (testResult.passed) {
        passed++;
      } else {
        failed++;
      }
      if (testResult.timeout) {
        timeout++;
      }
      if (testCase?.isPublic !== false) {
        publicCount++;
      }
    }

    return {
      total,
      passed,
      failed,
      timeout,
      public: publicCount,
    };
  }
}
