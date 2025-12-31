import type { AnalysisData } from '../types';

export const mockAnalysisData: AnalysisData = {
  findings: [
    {
      id: 1,
      slide: 3,
      position: 25,
      severity: 'CRITICAL',
      category: 'Market',
      title: 'Metric Discrepancy',
      description:
        'The presented TAM figure of $50B lacks bottom-up validation. Industry reports cited don\'t align with the specific vertical segmentation shown. This creates uncertainty around market entry strategy and initial beachhead sizing.',
      biasTag: 'Anchoring Bias',
      strategicQuestions: [
        'Walk me through your bottoms-up TAM calculation. If we multiply your target customer count by ACV, what number do we get?',
        'Which specific industry reports support your $50B figure? Can you show the methodology used?',
        'How does your TAM break down by customer segment and geography?',
      ],
      elevatedQuestions: [
        'Walk me through your bottoms-up TAM calculation. If we multiply your target customer count by ACV, what number do we get?',
      ],
      logicEvidence: {
        signals: [
          'TAM figure appears on slide without supporting calculation',
          'Industry reports mentioned but not linked to specific segments',
          'No SAM/SOM breakdown provided',
        ],
        confidence: 0.89,
      },
    },
    {
      id: 2,
      slide: 3,
      position: 55,
      severity: 'CONCERN',
      category: 'Market',
      title: 'Vague Differentiation',
      description:
        'The competitive advantage statement uses generic qualifiers without specificity. "Unique AI-powered solution" and "unprecedented value" are linguistic hedging that obscures the actual technical or business moat.',
      biasTag: 'Confirmation Bias',
      strategicQuestions: [
        'Name the specific technical architecture decision that makes your solution 10x better than the incumbent. What would it take a competitor to replicate this?',
        'What is the single metric where you outperform competitors by at least 3x?',
        'If I asked your customers why they chose you over alternatives, what specific feature would they cite?',
      ],
      elevatedQuestions: [
        'Name the specific technical architecture decision that makes your solution 10x better than the incumbent. What would it take a competitor to replicate this?',
      ],
      logicEvidence: {
        signals: [
          'Use of generic terms: "unique", "unprecedented", "innovative"',
          'No quantitative differentiation metrics',
          'Competitive landscape missing direct comparisons',
        ],
        confidence: 0.76,
      },
    },
    {
      id: 3,
      slide: 3,
      position: 78,
      severity: 'WATCH',
      category: 'Financial',
      title: 'Unsubstantiated Projection',
      description:
        'Revenue projections show $10M ARR by end of Year 2, scaling to $50M by Year 3. Current market momentum and go-to-market strategy details are insufficient to validate this growth curve. The assumption of 25% CAGR appears optimistic without demonstrated product-market fit.',
      biasTag: 'Optimism Bias',
      strategicQuestions: [
        'What is your current MRR and growth rate over the last 6 months?',
        'How many sales cycles have you completed? What is the average deal size and close rate?',
        'What assumptions about customer acquisition cost and payback period underpin your Year 2 projection?',
      ],
      elevatedQuestions: [
        'What assumptions about customer acquisition cost and payback period underpin your Year 2 projection?',
      ],
      logicEvidence: {
        signals: [
          'Exponential revenue curve without historical data points',
          'No CAC/LTV metrics provided',
          'Go-to-market strategy lacks execution detail',
        ],
        confidence: 0.82,
      },
    },
    {
      id: 4,
      slide: 5,
      position: 35,
      severity: 'CONCERN',
      category: 'Team',
      title: 'Team Experience Gap',
      description:
        'The team slide highlights brand names (Google, McKinsey) without specifying individual role accomplishments or relevant domain expertise. This is the halo effect from institutional prestige masking the lack of demonstrated experience scaling a B2B SaaS product from $1M to $10M ARR.',
      biasTag: 'Halo Effect',
      strategicQuestions: [
        'Who on the team has direct experience scaling a B2B SaaS product from $1M to $10M ARR?',
        'What specific technical or go-to-market challenge did each founder solve in their previous role that\'s directly applicable here?',
        'How long did each team member spend at the companies mentioned? What level were they at?',
      ],
      elevatedQuestions: [
        'Who on the team has direct experience scaling a B2B SaaS product from $1M to $10M ARR?',
      ],
      logicEvidence: {
        signals: [
          'Emphasis on company names rather than individual achievements',
          'No specific revenue scaling experience mentioned',
          'Missing technical leadership depth for AI product',
        ],
        confidence: 0.71,
      },
    },
    {
      id: 5,
      slide: 7,
      position: 42,
      severity: 'WATCH',
      category: 'Traction',
      title: 'Customer Validation Insufficient',
      description:
        'Traction metrics cite "growing customer base" and "strong user feedback" without quantifiable evidence. Agent deletion in customer acquisition claims suggests selection bias—only successful logos are shown, not churn or failed pilots.',
      biasTag: 'Survivorship Bias',
      strategicQuestions: [
        'How many customers have you acquired in the last 3 months? What is your current churn rate?',
        'Of the pilots you\'ve run, how many converted to paid contracts? What was the primary objection from those who didn\'t convert?',
        'What percentage of your current customers are active users (DAU/MAU)?',
      ],
      elevatedQuestions: [
        'Of the pilots you\'ve run, how many converted to paid contracts? What was the primary objection from those who didn\'t convert?',
      ],
      logicEvidence: {
        signals: [
          'Qualitative claims without quantitative backing',
          'Customer logos shown but no retention metrics',
          'No mention of failed experiments or churn',
        ],
        confidence: 0.68,
      },
    },
    {
      id: 6,
      slide: 9,
      position: 28,
      severity: 'CRITICAL',
      category: 'Product',
      title: 'Technical Feasibility Unclear',
      description:
        'The product roadmap promises AI capabilities that require significant ML infrastructure and data pipelines, but the deck provides no evidence of existing technical architecture, model performance benchmarks, or data acquisition strategy. This suggests anchoring to a vision without validated proof of concept.',
      biasTag: 'Anchoring Bias',
      strategicQuestions: [
        'What is the current accuracy of your core ML model? How does it compare to open-source alternatives?',
        'How much labeled training data do you have? What is your data acquisition and labeling strategy?',
        'Who on the team is responsible for ML infrastructure? What\'s their background in production ML systems?',
      ],
      elevatedQuestions: [
        'What is the current accuracy of your core ML model? How does it compare to open-source alternatives?',
      ],
      logicEvidence: {
        signals: [
          'AI/ML claims without technical validation',
          'No model performance metrics or benchmarks',
          'Infrastructure and scalability not addressed',
        ],
        confidence: 0.85,
      },
    },
    {
      id: 7,
      slide: 11,
      position: 65,
      severity: 'CONCERN',
      category: 'Financial',
      title: 'Unit Economics Missing',
      description:
        'The financial model projects revenue growth without disclosing CAC, LTV, gross margins, or burn rate. Recency bias may be influencing projections based on recent momentum rather than sustainable unit economics.',
      biasTag: 'Recency Bias',
      strategicQuestions: [
        'What is your current CAC and LTV? What is the payback period?',
        'What are your gross margins? How do they compare to industry benchmarks for your business model?',
        'What is your current monthly burn rate? How many months of runway do you have post-raise?',
      ],
      elevatedQuestions: [
        'What is your current CAC and LTV? What is the payback period?',
      ],
      logicEvidence: {
        signals: [
          'Revenue projections without cost structure',
          'No discussion of customer acquisition efficiency',
          'Burn rate and runway not mentioned',
        ],
        confidence: 0.79,
      },
    },
  ],

  thesisVulnerabilities: [
    {
      id: 1,
      title: 'Metric Discrepancy',
      signal: 'Anchoring to industry reports without validation',
      severity: 'CRITICAL',
      category: 'Market',
      relatedFindings: [1],
      relatedQuestions: ['Q01', 'Q02'],
    },
    {
      id: 2,
      title: 'Vague Differentiation',
      signal: 'Linguistic hedging with generic qualifiers',
      severity: 'CONCERN',
      category: 'Market',
      relatedFindings: [2],
      relatedQuestions: ['Q03', 'Q04'],
    },
    {
      id: 3,
      title: 'Unsubstantiated Projection',
      signal: 'Optimism bias in extrapolation from momentum',
      severity: 'CONCERN',
      category: 'Traction',
      relatedFindings: [3, 7],
      relatedQuestions: ['Q05', 'Q06', 'Q11'],
    },
    {
      id: 4,
      title: 'Team Experience Gap',
      signal: 'Halo effect from brand names without role specifics',
      severity: 'CONCERN',
      category: 'Team',
      relatedFindings: [4],
      relatedQuestions: ['Q07'],
    },
    {
      id: 5,
      title: 'Customer Validation Insufficient',
      signal: 'Agent deletion in customer acquisition claims',
      severity: 'CONCERN',
      category: 'Traction',
      relatedFindings: [5],
      relatedQuestions: ['Q08', 'Q09'],
    },
    {
      id: 6,
      title: 'Technical Feasibility Unclear',
      signal: 'Anchoring to AI vision without proof of concept',
      severity: 'CRITICAL',
      category: 'Product',
      relatedFindings: [6],
      relatedQuestions: ['Q10'],
    },
    {
      id: 7,
      title: 'Unit Economics Missing',
      signal: 'Recency bias in financial projections',
      severity: 'CONCERN',
      category: 'Financial',
      relatedFindings: [7],
      relatedQuestions: ['Q12', 'Q13'],
    },
  ],

  questionGroups: [
    {
      category: 'Team',
      questions: [
        {
          id: 'Q07',
          text: 'Who on the team has direct experience scaling a B2B SaaS product from $1M to $10M ARR?',
          relatedVulnerabilities: [4],
          isElevated: true,
        },
      ],
    },
    {
      category: 'Market',
      questions: [
        {
          id: 'Q01',
          text: 'Walk me through your bottoms-up TAM calculation. If we multiply your target customer count by ACV, what number do we get?',
          relatedVulnerabilities: [1],
          isElevated: true,
        },
        {
          id: 'Q02',
          text: 'Which specific industry reports support your $50B figure? Can you show the methodology used?',
          relatedVulnerabilities: [1],
          isElevated: false,
        },
        {
          id: 'Q03',
          text: 'Name the specific technical architecture decision that makes your solution 10x better than the incumbent. What would it take a competitor to replicate this?',
          relatedVulnerabilities: [2],
          isElevated: true,
        },
        {
          id: 'Q04',
          text: 'What is the single metric where you outperform competitors by at least 3x?',
          relatedVulnerabilities: [2],
          isElevated: false,
        },
      ],
    },
    {
      category: 'Product',
      questions: [
        {
          id: 'Q10',
          text: 'What is the current accuracy of your core ML model? How does it compare to open-source alternatives?',
          relatedVulnerabilities: [6],
          isElevated: true,
        },
      ],
    },
    {
      category: 'Traction',
      questions: [
        {
          id: 'Q05',
          text: 'What is your current MRR and growth rate over the last 6 months?',
          relatedVulnerabilities: [3],
          isElevated: false,
        },
        {
          id: 'Q06',
          text: 'What assumptions about customer acquisition cost and payback period underpin your Year 2 projection?',
          relatedVulnerabilities: [3],
          isElevated: true,
        },
        {
          id: 'Q08',
          text: 'How many customers have you acquired in the last 3 months? What is your current churn rate?',
          relatedVulnerabilities: [5],
          isElevated: false,
        },
        {
          id: 'Q09',
          text: 'Of the pilots you\'ve run, how many converted to paid contracts? What was the primary objection from those who didn\'t convert?',
          relatedVulnerabilities: [5],
          isElevated: true,
        },
      ],
    },
    {
      category: 'Financial',
      questions: [
        {
          id: 'Q11',
          text: 'How many sales cycles have you completed? What is the average deal size and close rate?',
          relatedVulnerabilities: [3],
          isElevated: false,
        },
        {
          id: 'Q12',
          text: 'What is your current CAC and LTV? What is the payback period?',
          relatedVulnerabilities: [7],
          isElevated: true,
        },
        {
          id: 'Q13',
          text: 'What are your gross margins? How do they compare to industry benchmarks for your business model?',
          relatedVulnerabilities: [7],
          isElevated: false,
        },
      ],
    },
  ],

  metadata: {
    stage: 'Seed',
    slideCount: 12,
    analyzedAt: new Date().toISOString(),
  },
};
