const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// 1. Add import
const targetImport = `import { createServer as createViteServer } from 'vite';`;
const replacementImport = `import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';`;
code = code.replace(targetImport, replacementImport);

// 2. Add endpoint
const targetRoutes = `  // API Routes
  app.use('/api/auth', authRoutes);`;
const replacementRoutes = `  // API Routes
  app.post('/api/google/create-doc', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Unauthorized');
    const token = authHeader.split(' ')[1];
    const { title, content } = req.body;
    
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: token });
      const docs = google.docs({ version: 'v1', auth });
      const doc = await docs.documents.create({ requestBody: { title } });
      await docs.documents.batchUpdate({
        documentId: doc.data.documentId,
        requestBody: {
          requests: [{ insertText: { text: content, location: { index: 1 } } }]
        }
      });
      res.json({ docId: doc.data.documentId });
    } catch (e) {
      console.error(e);
      res.status(500).send('Gagal membuat dokumen');
    }
  });

  app.use('/api/auth', authRoutes);`;
code = code.replace(targetRoutes, replacementRoutes);

fs.writeFileSync('server.ts', code);
console.log('server.ts patched for docs');
