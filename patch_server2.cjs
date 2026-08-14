const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetImport = `import { globalErrorHandler } from './src/middleware/errorHandler.js';`;
const replacementImport = `import { globalErrorHandler } from './src/middleware/errorHandler.js';
import { contextStorage } from './src/utils/context.js';`;
code = code.replace(targetImport, replacementImport);

const targetMiddleware = `  app.use(express.urlencoded({ extended: true }));`;
const replacementMiddleware = `  app.use(express.urlencoded({ extended: true }));

  // Request Context Middleware (for Multi-AI Config)
  app.use((req, res, next) => {
    const customApiKeysRaw = req.headers['x-custom-api-keys'];
    let customApiKeys = null;
    if (customApiKeysRaw) {
      try {
        customApiKeys = JSON.parse(decodeURIComponent(customApiKeysRaw));
      } catch (e) {}
    }
    contextStorage.run({ customApiKeys }, () => {
      next();
    });
  });`;
code = code.replace(targetMiddleware, replacementMiddleware);

fs.writeFileSync('server.ts', code);
console.log('server.ts patched');
