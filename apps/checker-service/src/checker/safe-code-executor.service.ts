import { Injectable, Logger } from '@nestjs/common';
import { TestCaseDto } from './dto/check.dto';
import { TestResultDto } from './dto/check-result.dto';
import * as vm from 'vm';

@Injectable()
export class SafeCodeExecutorService {
  private readonly logger = new Logger(SafeCodeExecutorService.name);

  async executeCodeSafely(
    code: string,
    testCase: TestCaseDto,
    language: string,
    timeout: number = 1000,
  ): Promise<TestResultDto> {
    try {
      // Підготовка коду для виконання
      const processedCode = this.processCode(code, language);

      // Створюємо безпечне середовище виконання
      const sandbox = this.createSandbox();

      // Виконуємо код з таймаутом
      const result = await this.executeWithTimeout(
        processedCode,
        testCase.input,
        timeout,
        sandbox,
      );

      const actualString = String(result);
      const passed = actualString === testCase.expected;

      return {
        passed,
        actual: actualString,
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
        timeout: false,
      };
    } catch (error) {
      this.logger.error(`Error executing code: ${error.message}`);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isTimeout =
        errorMessage.includes('timeout') || errorMessage.includes('timed out');

      return {
        passed: false,
        actual: `Error: ${errorMessage}`,
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
        timeout: isTimeout,
      };
    }
  }

  private createSandbox() {
    return {
      console: {
        log: () => {},
        error: () => {},
        warn: () => {},
        info: () => {},
        debug: () => {},
      },
      setTimeout: () => {},
      setInterval: () => {},
      clearTimeout: () => {},
      clearInterval: () => {},
      process: {
        exit: () => {},
        env: {},
        cwd: () => '/sandbox',
        platform: 'linux',
        arch: 'x64',
        version: process.version,
        versions: process.versions,
      },
      Buffer: Buffer,
      TextEncoder: TextEncoder,
      TextDecoder: TextDecoder,
      URL: URL,
      URLSearchParams: URLSearchParams,
      // Базові математичні функції
      Math: Math,
      Number: Number,
      String: String,
      Boolean: Boolean,
      Array: Array,
      Object: Object,
      Date: Date,
      RegExp: RegExp,
      JSON: JSON,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      escape: escape,
      unescape: unescape,
      encodeURI: encodeURI,
      encodeURIComponent: encodeURIComponent,
      decodeURI: decodeURI,
      decodeURIComponent: decodeURIComponent,
      // Обмежуємо доступ до глобальних об'єктів
      global: undefined,
      window: undefined,
      document: undefined,
      location: undefined,
      history: undefined,
      navigator: undefined,
      screen: undefined,
      localStorage: undefined,
      sessionStorage: undefined,
      indexedDB: undefined,
      crypto: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
      WebSocket: undefined,
      EventSource: undefined,
      Worker: undefined,
      SharedWorker: undefined,
      ServiceWorker: undefined,
      BroadcastChannel: undefined,
      MessageChannel: undefined,
      MessagePort: undefined,
      Performance: undefined,
      PerformanceObserver: undefined,
      PerformanceEntry: undefined,
      PerformanceMark: undefined,
      PerformanceMeasure: undefined,
      PerformanceNavigationTiming: undefined,
      PerformanceResourceTiming: undefined,
      PerformancePaintTiming: undefined,
      PerformanceLongTaskTiming: undefined,
      PerformanceObserverEntryList: undefined,
    };
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

  private async executeWithTimeout(
    code: string,
    input: unknown,
    timeout: number,
    sandbox: any,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('timeout'));
      }, timeout);

      try {
        // Створюємо безпечну функцію
        const safeCode = `
          (function() {
            'use strict';
            ${code}
            
            // Викликаємо функцію main або solution
            if (typeof main === 'function') {
              return main(${JSON.stringify(input)});
            } else if (typeof solution === 'function') {
              return solution(${JSON.stringify(input)});
            } else {
              throw new Error('Function main or solution is not defined');
            }
          })();
        `;

        // Виконуємо код в безпечному середовищі
        const context = vm.createContext(sandbox);
        const script = new vm.Script(safeCode);

        const result = script.runInContext(context, {
          timeout: timeout,
          displayErrors: false,
          breakOnSigint: false,
        });

        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }
}
