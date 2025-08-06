#!/usr/bin/env node

const { parentPort } = require('worker_threads');

// Отримуємо дані від батьківського процесу
parentPort.on('message', async (data) => {
  try {
    const { code, input, timeout = 1000 } = data;
    
    // Створюємо безпечне середовище виконання
    const sandbox = {
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
        cwd: () => '/app',
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
      // Додаємо базові математичні функції
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
    };

    // Виконуємо код з таймаутом
    const result = await executeWithTimeout(code, input, timeout, sandbox);
    
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    parentPort.postMessage({ 
      success: false, 
      error: error.message,
      timeout: error.message.includes('timeout')
    });
  }
});

function executeWithTimeout(code, input, timeout, sandbox) {
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
      const vm = require('vm');
      const context = vm.createContext(sandbox);
      const script = new vm.Script(safeCode);
      
      const result = script.runInContext(context, {
        timeout: timeout,
        displayErrors: false,
        breakOnSigint: false,
        breakOnSigterm: false,
      });

      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
} 