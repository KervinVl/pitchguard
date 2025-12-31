import { create } from 'zustand';
import type { AnalysisData, Finding, FundingStage } from '../types';

interface AppState {
  // View state
  view: 'entry' | 'loading' | 'analysis';
  analysisSubView: 'pdf' | 'ledger';

  // Upload state
  selectedStage: FundingStage | null;
  uploadedFile: File | null;

  // Analysis state
  analysisData: AnalysisData | null;
  currentSlide: number;

  // Interaction state
  selectedFinding: Finding | null;
  selectedVulnerability: number | null;
  isDrawerOpen: boolean;

  // Session state
  sessionStartTime: number | null;

  // Actions
  setView: (view: 'entry' | 'loading' | 'analysis') => void;
  setAnalysisSubView: (subView: 'pdf' | 'ledger') => void;
  setSelectedStage: (stage: FundingStage | null) => void;
  setUploadedFile: (file: File | null) => void;
  setAnalysisData: (data: AnalysisData) => void;
  setCurrentSlide: (slide: number) => void;
  selectFinding: (finding: Finding | null) => void;
  selectVulnerability: (id: number | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  startSession: () => void;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: 'entry',
  analysisSubView: 'pdf',
  selectedStage: null,
  uploadedFile: null,
  analysisData: null,
  currentSlide: 1,
  selectedFinding: null,
  selectedVulnerability: null,
  isDrawerOpen: false,
  sessionStartTime: null,

  setView: (view) => set({ view }),
  setAnalysisSubView: (analysisSubView) => set({ analysisSubView }),
  setSelectedStage: (selectedStage) => set({ selectedStage }),
  setUploadedFile: (uploadedFile) => set({ uploadedFile }),
  setAnalysisData: (analysisData) => set({ analysisData }),
  setCurrentSlide: (currentSlide) => set({ currentSlide }),
  selectFinding: (selectedFinding) => set({ selectedFinding }),
  selectVulnerability: (selectedVulnerability) => set({ selectedVulnerability }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedFinding: null }),
  startSession: () => set({ sessionStartTime: Date.now() }),
  resetSession: () =>
    set({
      view: 'entry',
      analysisSubView: 'pdf',
      selectedStage: null,
      uploadedFile: null,
      analysisData: null,
      currentSlide: 1,
      selectedFinding: null,
      selectedVulnerability: null,
      isDrawerOpen: false,
      sessionStartTime: null,
    }),
}));
