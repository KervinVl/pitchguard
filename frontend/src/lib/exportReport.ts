import type { AnalysisData } from '../types';

export function generateMarkdownReport(data: AnalysisData): string {
  const { findings, thesisVulnerabilities, questionGroups, metadata } = data;

  const markdown = `# PitchGuard Analysis Report

**Stage:** ${metadata.stage}
**Analyzed:** ${new Date(metadata.analyzedAt).toLocaleString()}
**Slides:** ${metadata.slideCount}

---

## Executive Summary

### Thesis Vulnerabilities

${thesisVulnerabilities
  .map(
    (v, idx) =>
      `${idx + 1}. **${v.title}** (${v.severity})
   *Signal:* ${v.signal}
   *Category:* ${v.category}`
  )
  .join('\n\n')}

---

## Findings by Slide

${findings
  .sort((a, b) => a.slide - b.slide)
  .map(
    (f) =>
      `### Slide ${f.slide}: ${f.title}

**Severity:** ${f.severity}
**Category:** ${f.category}
**Bias:** ${f.biasTag}
**Confidence:** ${Math.round(f.logicEvidence.confidence * 100)}%

${f.description}

**Strategic Questions:**
${f.strategicQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}

**Logic Evidence:**
${f.logicEvidence.signals.map((s) => `- ${s}`).join('\n')}
`
  )
  .join('\n---\n\n')}

---

## Strategic Questions

${questionGroups
  .map(
    (group) =>
      `### ${group.category} (${group.questions.length})

${group.questions.map((q) => `**${q.id}:** ${q.text}`).join('\n\n')}`
  )
  .join('\n\n')}

---

*Generated with [PitchGuard](https://pitchguard.app) - AI-Powered Venture Capital Audit Tool*
`;

  return markdown;
}

export function downloadMarkdown(markdown: string, filename: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
