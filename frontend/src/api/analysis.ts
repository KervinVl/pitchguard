import type { AnalysisData, FundingStage } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function analyzeDocument(
  file: File,
  stage: FundingStage
): Promise<AnalysisData> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('stage', stage);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    // Handle HTML error responses (e.g., from Railway)
    if (contentType?.includes('text/html')) {
      const text = await response.text();
      if (text.includes('504') || text.includes('Gateway Timeout')) {
        throw new Error('Analysis timed out. Your PDF may be too large or complex. Try a smaller deck.');
      }
      throw new Error('Server error occurred. Please try again or contact support.');
    }

    const error = await response.json();
    throw new Error(error.error || 'Analysis failed');
  }

  // Handle non-JSON responses
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Unexpected server response: ${text.substring(0, 100)}...`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Analysis failed');
  }

  return result.data;
}
