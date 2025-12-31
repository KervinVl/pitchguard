import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertPdfToImages } from './utils/pdfConverter.js';
import { analyzePitchDeck } from './services/claudeAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root directory
const envResult = dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (envResult.parsed) {
  Object.assign(process.env, envResult.parsed);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analyze endpoint - Full Claude Vision integration
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    // Validate funding stage
    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({
        success: false,
        error: 'Funding stage is required',
      });
    }

    const validStages = ['Pre-Seed', 'Seed', 'Series A', 'Series B+'];
    if (!validStages.includes(stage)) {
      return res.status(400).json({
        success: false,
        error: `Invalid funding stage. Must be one of: ${validStages.join(', ')}`,
      });
    }

    console.log(`[server] Received ${stage} deck analysis request`);
    console.log(`[server] File size: ${(req.file.size / 1024 / 1024).toFixed(2)}MB`);

    // Step 1: Convert PDF to images
    console.log('[server] Converting PDF to images...');
    const pages = await convertPdfToImages(req.file.buffer);
    console.log(`[server] Converted ${pages.length} pages`);

    // Step 2: Analyze with Claude Vision
    console.log('[server] Sending to Claude for analysis...');
    const analysisResult = await analyzePitchDeck(pages, stage);
    console.log(`[server] Analysis complete: ${analysisResult.findings.length} findings`);

    // Step 3: Return structured response
    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error('[server] Analysis error:', error);

    // User-friendly error messages
    let errorMessage = 'Analysis failed';
    if (error instanceof Error) {
      if (error.message.includes('PDF conversion')) {
        errorMessage = 'Failed to process PDF file. Please ensure it is a valid PDF.';
      } else if (error.message.includes('Claude analysis')) {
        errorMessage = 'AI analysis failed. Please try again.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'Server configuration error. Please contact support.';
      } else {
        errorMessage = error.message;
      }
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
);

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
  console.log(`[server] Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`[server] API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[server] WARNING: ANTHROPIC_API_KEY not found in environment variables!');
    console.error('[server] Make sure .env file exists in backend/ directory');
  }
});
