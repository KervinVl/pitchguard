export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B+';

export type Severity = 'CRITICAL' | 'CONCERN' | 'WATCH';

export type Category = 'Team' | 'Market' | 'Product' | 'Traction' | 'Financial';

export interface Finding {
  id: number;
  slide: number;              // PDF page number (1-indexed)
  severity: Severity;
  category: string;
  title: string;
  description: string;
  biasTag: string;           // e.g., "Anchoring Bias"
  strategicQuestions: string[];
  logicEvidence: {
    signals: string[];
    confidence: number;       // 0-1
  };
}

export interface ThesisVulnerability {
  id: number;
  title: string;
  impact: string;
  category: string;
  relatedFindings: number[];  // Finding IDs
}

export interface AnalysisData {
  findings: Finding[];
  thesisVulnerabilities: ThesisVulnerability[];
  metadata: {
    stage: FundingStage;
    slideCount: number;
    analyzedAt: string;       // ISO timestamp
  };
}

export interface UploadRequest {
  file: File;
  stage: FundingStage;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisData;
  error?: string;
}
