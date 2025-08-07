import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { TestCaseDto } from './dto/check.dto';
import { TestResultDto } from './dto/check-result.dto';

@Injectable()
export class CodeExecutorService {
  private readonly logger = new Logger(CodeExecutorService.name);

  async executeCodeInContainer(
    code: string,
    testCase: TestCaseDto,
    language: string,
    timeout: number = 1000,
  ): Promise<TestResultDto> {
    try {
      const containerTag = `code-runner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const processedCode = this.processCode(code, language);

      const result = await this.runDockerContainer(
        containerTag,
        processedCode,
        testCase.input,
        timeout,
      );

      if (result.success) {
        const actualString = String(result.result);
        const passed = actualString === testCase.expected;

        return {
          passed,
          actual: actualString,
          expected: testCase.expected,
          description: testCase.description,
          input: testCase.input,
          timeout: false,
        };
      } else {
        return {
          passed: false,
          actual: `Error: ${result.error}`,
          expected: testCase.expected,
          description: testCase.description,
          input: testCase.input,
          timeout: result.timeout || false,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error executing code in container: ${(error as Error).message}`,
      );
      return {
        passed: false,
        actual: `Error: ${(error as Error).message}`,
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
        timeout: false,
      };
    }
  }

  private processCode(code: string, language: string): string {
    if (language === 'typescript') {
      return this.removeTypeScriptTypes(code);
    }
    return code;
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

  private async runDockerContainer(
    containerTag: string,
    code: string,
    input: unknown,
    timeout: number,
  ): Promise<{
    success: boolean;
    result?: unknown;
    error?: string;
    timeout?: boolean;
  }> {
    return new Promise((resolve) => {
      const dockerArgs = [
        'run',
        '--rm',
        '--memory=128m',
        '--cpus=0.5',
        '--network=none',
        '--read-only',
        '--security-opt=no-new-privileges',
        '--user=1001:1001',
        '-e',
        `TIMEOUT=${timeout}`,
        'code-runner:latest',
      ];

      const dockerProcess = spawn('docker', dockerArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Відправляємо дані в контейнер
      const inputData = JSON.stringify({ code, input, timeout });
      dockerProcess.stdin.write(inputData);
      dockerProcess.stdin.end();

      let stdout = '';
      let stderr = '';

      dockerProcess.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      dockerProcess.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      dockerProcess.on('close', (code: number | null) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout) as {
              success: boolean;
              result?: unknown;
              error?: string;
              timeout?: boolean;
            };
            resolve(result);
          } catch {
            resolve({
              success: false,
              error: 'Invalid JSON response from container',
            });
          }
        } else {
          resolve({
            success: false,
            error: stderr || 'Container execution failed',
          });
        }
      });

      dockerProcess.on('error', (error: Error) => {
        resolve({
          success: false,
          error: `Docker error: ${error.message}`,
        });
      });
    });
  }
}
