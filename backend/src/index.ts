import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
const PORT = parseInt(process.env.PORT || '3001', 10);
const isDev = process.env.NODE_ENV !== 'production';

// Security headers
app.use(helmet());

// Rate limiting — max 10 analysis requests per 15 minutes per IP
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

// CORS — no credentials needed (stateless API)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

// File upload configuration — use env var for max size
const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024,
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

// Analyze endpoint — with rate limiting
app.post('/api/analyze', analyzeLimiter, upload.single('file'), async (req, res) => {
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

    if (isDev) {
      console.log(`[server] Received ${stage} deck analysis request`);
      console.log(`[server] File size: ${(req.file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Step 1: Convert PDF to images
    if (isDev) console.log('[server] Converting PDF to images...');
    const pages = await convertPdfToImages(req.file.buffer);
    if (isDev) console.log(`[server] Converted ${pages.length} pages`);

    // Step 2: Analyze with Claude Vision
    if (isDev) console.log('[server] Sending to Claude for analysis...');
    const analysisResult = await analyzePitchDeck(pages, stage);
    if (isDev) console.log(`[server] Analysis complete: ${analysisResult.findings.length} findings`);

    // Step 3: Return structured response
    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    if (isDev) {
      console.error('[server] Analysis error:', error);
    } else {
      console.error('[server] Analysis error:', error instanceof Error ? error.message : 'Unknown error');
    }

    // User-friendly error messages — never expose internals
    let errorMessage = 'Analysis failed. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('PDF conversion')) {
        errorMessage = 'Failed to process PDF file. Please ensure it is a valid PDF.';
      } else if (error.message.includes('Claude analysis')) {
        errorMessage = 'AI analysis failed. Please try again.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'Server configuration error. Please contact support.';
      }
      // Do NOT fall through to error.message — keep generic
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Global error handling middleware — never leak stack traces
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (isDev) {
      console.error('[server] Unhandled error:', err.stack);
    } else {
      console.error('[server] Unhandled error:', err.message);
    }

    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    });
  }
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Running on port ${PORT}`);
  console.log(`[server] Environment: ${isDev ? 'development' : 'production'}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[server] WARNING: ANTHROPIC_API_KEY not found in environment variables!');
    console.error('[server] Make sure .env file exists in backend/ directory');
  }
});
