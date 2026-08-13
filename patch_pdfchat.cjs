const fs = require('fs');
let code = fs.readFileSync('src/controllers/pdfChatController.ts', 'utf8');

// Add userEmail to PdfDocument
code = code.replace(/rawText: string;/g, "rawText: string;\n  userEmail?: string;");

// In uploadDocument, capture userEmail
const uploadDocTarget = `  const newDoc: PdfDocument = {
    id,
    filename: req.file.originalname,`;
const uploadDocReplacement = `  const userEmail = req.headers['x-user-email'] as string || 'guest';
  const newDoc: PdfDocument = {
    id,
    userEmail,
    filename: req.file.originalname,`;
code = code.replace(uploadDocTarget, uploadDocReplacement);

// In getDocuments, filter by userEmail (except admin)
const getDocsTarget = `export const getDocuments = (req: Request, res: Response) => {
  const docs = Object.values(indexedDocuments).map(d => ({
    id: d.id,
    filename: d.filename,
    title: d.title,
    pageCount: d.pageCount,
    chunksCount: d.chunksCount,
    uploadedAt: d.uploadedAt
  }));
  res.json({ documents: docs });
};`;
const getDocsReplacement = `export const getDocuments = (req: Request, res: Response) => {
  const userEmail = req.headers['x-user-email'] as string;
  const userRole = req.headers['x-user-role'] as string;
  
  let docs = Object.values(indexedDocuments);
  if (userRole !== 'admin') {
     const currentEmail = userEmail || 'guest';
     docs = docs.filter(d => !d.userEmail || d.userEmail === currentEmail || d.id === 'demo-journal-1');
  }

  const mappedDocs = docs.map(d => ({
    id: d.id,
    filename: d.filename,
    title: d.title,
    pageCount: d.pageCount,
    chunksCount: d.chunksCount,
    uploadedAt: d.uploadedAt
  }));
  res.json({ documents: mappedDocs });
};`;
code = code.replace(getDocsTarget, getDocsReplacement);

// In chatHistories, scope by userEmail as well
// We can just append userEmail to the chatId
// Actually, chat messages are fetched via ID? Let's check how PdfChatPage stores messages.
// Wait, pdfChatController doesn't have a GET messages endpoint! The frontend maintains messages state and just passes them to POST /chat.
// So there's no leak of chat history between users!

fs.writeFileSync('src/controllers/pdfChatController.ts', code);
console.log('pdfChatController patched');
