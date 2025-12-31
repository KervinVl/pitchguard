import { Copy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VulnerabilityCard } from './VulnerabilityCard';
import { toast } from 'sonner';
import { useMemo } from 'react';

export function InsightsLedger(): JSX.Element {
  const { analysisData, selectedVulnerability } = useAppStore();

  if (!analysisData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-tertiary font-mono text-sm">No analysis data</p>
      </div>
    );
  }

  const { thesisVulnerabilities, findings } = analysisData;

  // Build list of all questions from findings
  const allQuestions = useMemo(() => {
    const questions: Array<{ findingId: number; text: string; relatedVulnerabilities: number[] }> = [];

    findings.forEach((finding) => {
      // Get related vulnerabilities for this finding
      const relatedVulnerabilities = thesisVulnerabilities
        .filter(v => v.relatedFindings.includes(finding.id))
        .map(v => v.id);

      // Add all strategic questions from this finding
      finding.strategicQuestions.forEach((questionText) => {
        questions.push({
          findingId: finding.id,
          text: questionText,
          relatedVulnerabilities,
        });
      });
    });

    return questions;
  }, [findings, thesisVulnerabilities]);

  // Filter questions by selected vulnerability
  const filteredQuestions = useMemo(() => {
    if (selectedVulnerability === null) {
      return allQuestions;
    }
    return allQuestions.filter((q) =>
      q.relatedVulnerabilities.includes(selectedVulnerability)
    );
  }, [allQuestions, selectedVulnerability]);

  const handleCopyAll = (): void => {
    const questionsText = filteredQuestions
      .map((q, idx) => `${idx + 1}. ${q.text}`)
      .join('\n\n');

    navigator.clipboard.writeText(questionsText);
    toast.success(`${filteredQuestions.length} questions copied to clipboard`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-bg-tertiary px-8 py-6">
        <h1 className="text-xl font-mono font-medium text-text-primary tracking-wider">
          INSIGHTS LEDGER
        </h1>
        <p className="text-sm text-text-secondary mt-1">Summary of Scrutiny</p>
      </div>

      {/* Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Thesis Vulnerabilities (40%) */}
        <div className="w-[40%] border-r border-bg-tertiary overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider mb-4">
              THESIS VULNERABILITIES
            </h2>
            <div className="space-y-3">
              {thesisVulnerabilities.map((vulnerability, index) => (
                <VulnerabilityCard
                  key={vulnerability.id}
                  vulnerability={vulnerability}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strategic Questions (60%) */}
        <div className="w-[60%] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider">
                STRATEGIC QUESTIONS ({filteredQuestions.length})
              </h2>
              <button
                onClick={handleCopyAll}
                disabled={filteredQuestions.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-xs border border-bg-tertiary rounded hover:border-text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Questions</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {filteredQuestions.map((question, idx) => (
                <div
                  key={`${question.findingId}-${idx}`}
                  className="p-4 rounded-lg border border-bg-tertiary bg-bg-secondary"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-tertiary mt-0.5">
                      Q{idx + 1}
                    </span>
                    <p className="flex-1 text-sm text-text-primary leading-relaxed">
                      {question.text}
                    </p>
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <p className="text-sm text-text-tertiary text-center py-8">
                  {selectedVulnerability !== null
                    ? 'No questions match the selected vulnerability'
                    : 'No strategic questions available'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
