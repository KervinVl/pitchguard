import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAppStore } from '../../store/useAppStore';
import { SmartPin } from './SmartPin';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFViewer(): JSX.Element {
  const { uploadedFile, analysisData, currentSlide } = useAppStore();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(1000);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  // Calculate width to fit viewport - recalculate when container size changes
  useEffect(() => {
    const calculateWidth = (): void => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Account for padding (64px total)
      const availableWidth = containerWidth - 64;
      const availableHeight = containerHeight - 64;

      // Simple approach: use available height to determine size
      // Landscape slides (16:9 ~ 1.78 ratio) at height H will have width H * 1.78
      // We want to maximize the slide size while fitting in the viewport

      // Try fitting by height (good for landscape) - reduce slightly for breathing room
      const widthIfFitByHeight = availableHeight * 1.65; // Slightly smaller than 1.78

      // Try fitting by width (good for portrait and extreme landscapes)
      const widthIfFitByWidth = availableWidth * 0.90; // Reduce from 0.95 to 0.90

      // Use whichever gives us a bigger slide that still fits
      const calculatedWidth = Math.min(widthIfFitByWidth, widthIfFitByHeight);

      setPageWidth(Math.max(calculatedWidth, 900));
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  if (!uploadedFile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary font-mono text-sm">No PDF loaded</p>
      </div>
    );
  }

  const findingsOnSlide = analysisData?.findings.filter((f) => f.slide === currentSlide) || [];
  const findingCount = findingsOnSlide.length;

  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center bg-bg-primary overflow-auto p-8">
      <div className="relative">
        <Document
          file={uploadedFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page
            pageNumber={currentSlide}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-2xl"
            width={pageWidth}
          />
        </Document>

        {/* Smart Pin - Fixed position top-right */}
        {findingCount > 0 && (
          <div className="absolute top-4 right-4 pointer-events-auto">
            <SmartPin count={findingCount} findings={findingsOnSlide} />
          </div>
        )}
      </div>
    </div>
  );
}
