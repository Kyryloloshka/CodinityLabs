import { Injectable } from '@nestjs/common';
import { TestCaseDto } from './dto/check.dto';
import { TestResultDto } from './dto/check-result.dto';
import * as vm from 'vm';

@Injectable()
export class SafeCodeExecutorService {
  async executeCodeSafely(
    code: string,
    testCase: TestCaseDto,
    language: string,
    timeout: number,
  ): Promise<TestResultDto> {
    const processedCode = this.processCode(code, language);
    const sandbox = this.createSandbox();

    try {
      const result = await this.executeWithTimeout(
        processedCode,
        testCase.input,
        sandbox,
        timeout,
      );

      return {
        passed: result === testCase.expected,
        actual: result,
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
        timeout: false,
      };
    } catch (error) {
      return {
        passed: false,
        actual:
          'Error: ' + (error instanceof Error ? error.message : String(error)),
        expected: testCase.expected,
        description: testCase.description,
        input: testCase.input,
        timeout: error instanceof Error && error.message.includes('timeout'),
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
    sandbox: Record<string, unknown>,
    timeout: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Execution timeout'));
      }, timeout);

      try {
        const safeCode = `
          (function() {
            'use strict';
            ${code}
            
            if (typeof main === 'function') {
              return main(${JSON.stringify(input)});
            } else if (typeof solution === 'function') {
              return solution(${JSON.stringify(input)});
            } else {
              throw new Error('Function main or solution is not defined');
            }
          })();
        `;

        const context = vm.createContext(sandbox);
        const script = new vm.Script(safeCode);

        const result = script.runInContext(context, {
          timeout: timeout,
          displayErrors: false,
          breakOnSigint: false,
        }) as unknown;

        clearTimeout(timeoutId);
        resolve(String(result));
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
}
