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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Analysis failed');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Analysis failed');
  }

  return result.data;
}
