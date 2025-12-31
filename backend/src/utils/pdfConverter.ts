import { pdfToPng } from 'pdf-to-png-converter';

export interface ConvertedPage {
  pageNumber: number;
  base64: string;
  width: number;
  height: number;
}

/**
 * Converts PDF buffer to array of PNG images as base64
 */
export async function convertPdfToImages(
  pdfBuffer: Buffer
): Promise<ConvertedPage[]> {
  try {
    const pngPages = await pdfToPng(pdfBuffer, {
      disableFontFace: false,
      useSystemFonts: false,
      viewportScale: 2.0, // Higher resolution for better OCR
      outputFolder: undefined, // Keep in memory
    });

    return pngPages.map((page, index) => ({
      pageNumber: index + 1,
      base64: page.content.toString('base64'),
      width: page.width,
      height: page.height,
    }));
  } catch (error) {
    throw new Error(
      `PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
