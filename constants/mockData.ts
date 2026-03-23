export const mockResults = {
  score: 84,
  scoreChange: '+12% vs last month',
  engines: [
    {
      name: 'Perplexity',
      score: 92,
      sentiment: 'POSITIVE SENTIMENT',
      sentimentWarning: false,
      snippet:
        'Consistently cited as an authoritative source with strong domain expertise and high citation frequency across knowledge graphs.',
    },
    {
      name: 'ChatGPT',
      score: 76,
      sentiment: 'NEUTRAL SNIPPET',
      sentimentWarning: true,
      snippet:
        'Brand is recognized but described in neutral, non-differentiating language. Missing key value propositions and competitive positioning.',
    },
    {
      name: 'Bing',
      score: 84,
      sentiment: 'HIGH VISIBILITY',
      sentimentWarning: false,
      snippet:
        'Strong index presence with consistent brand mentions. Copilot surfaces brand in relevant queries with accurate product descriptions.',
    },
  ],
  sentimentMix: { positive: 70, neutral: 20, negative: 10 },
  primaryGap: {
    title: 'Semantic Latency in GPT-4',
    description:
      "Your latest product updates have not propagated to ChatGPT's knowledge base. Estimated ~14 day indexing delay detected.",
  },
  gaps: {
    critical: [
      {
        id: 'GAP-0922',
        title: 'Missing Pricing Context',
        description:
          'ChatGPT has no knowledge of your current pricing tiers. Users asking about cost receive outdated or no information.',
        engine: 'ChatGPT',
        score: 0.82,
      },
      {
        id: 'GAP-0941',
        title: 'Outdated Regulatory Citation',
        description:
          'Perplexity is citing a 2022 compliance document. Your updated 2024 certifications are not indexed.',
        engine: 'Perplexity',
        score: 0.91,
      },
    ],
    warnings: [
      {
        id: 'GAP-1002',
        title: 'Semantic Misalignment',
        description:
          'Bing Copilot uses different terminology than your brand guidelines, causing inconsistent messaging.',
        engine: 'Bing',
        score: 0.44,
      },
      {
        id: 'GAP-1015',
        title: 'Incomplete Product Catalog',
        description:
          'ChatGPT only knows about 3 of your 12 product lines. New offerings launched in Q3 are invisible.',
        engine: 'ChatGPT',
        score: 0.56,
      },
      {
        id: 'GAP-1023',
        title: 'Missing Leadership Info',
        description:
          'Perplexity has no information about your current executive team. Old leadership data from 2021 is surfaced.',
        engine: 'Perplexity',
        score: 0.38,
      },
      {
        id: 'GAP-1031',
        title: 'No Customer Testimonials',
        description:
          'Bing Copilot lacks social proof data. Competitor brands with testimonials rank higher in trust signals.',
        engine: 'Bing',
        score: 0.51,
      },
    ],
  },
};
