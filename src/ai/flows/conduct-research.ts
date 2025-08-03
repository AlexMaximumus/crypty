'use server';

/**
 * @fileOverview Conducts automated research based on provided market data.
 *
 * - conductResearch - A function that performs a comprehensive market analysis.
 * - ConductResearchInput - The input type for the conductResearch function.
 * - ConductResearchOutput - The return type for the conductResearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConductResearchInputSchema = z.object({
  cryptocurrency: z.string().describe('The cryptocurrency to analyze (e.g., BTC, ETH).'),
  marketData: z.string().describe('Key market data including price, volume, order book depth, and open interest.'),
  onChainData: z.string().describe('On-chain data like active addresses, transaction volume, and exchange flows.'),
  technicalIndicators: z.string().describe('Technical indicators such as RSI, MACD, Bollinger Bands, and moving averages.'),
  sentimentMetrics: z.string().describe('Sentiment metrics from social media, news, and Google Trends.'),
});
export type ConductResearchInput = z.infer<typeof ConductResearchInputSchema>;

const ConductResearchOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the market situation.'),
  marketAnalysis: z.string().describe('Detailed analysis of market data.'),
  onChainAnalysis: z.string().describe('Detailed analysis of on-chain data.'),
  technicalAnalysis: z.string().describe('Detailed analysis of technical indicators.'),
  sentimentAnalysis: z.string().describe('Detailed analysis of sentiment metrics.'),
  recommendation: z.string().describe('A trading recommendation (Buy, Sell, Hold) based on the comprehensive analysis.'),
  confidenceScore: z.number().describe('A score from 0 to 1 indicating the confidence in the recommendation.'),
});
export type ConductResearchOutput = z.infer<typeof ConductResearchOutputSchema>;

export async function conductResearch(input: ConductResearchInput): Promise<ConductResearchOutput> {
  return conductResearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conductResearchPrompt',
  input: {schema: ConductResearchInputSchema},
  output: {schema: ConductResearchOutputSchema},
  prompt: `You are a professional cryptocurrency analyst. Your task is to conduct a comprehensive automated research for {{cryptocurrency}} based on the provided data. Structure your analysis into the following sections: Summary, Market Analysis, On-Chain Analysis, Technical Analysis, and Sentiment Analysis.
All responses must be in Russian.

  Provide a clear trading recommendation (Buy, Sell, or Hold) and a confidence score. Be thorough, data-driven, and objective in your analysis.

  Data Provided:
  - Cryptocurrency: {{cryptocurrency}}
  - Market Data: {{{marketData}}}
  - On-Chain Data: {{{onChainData}}}
  - Technical Indicators: {{{technicalIndicators}}}
  - Sentiment Metrics: {{{sentimentMetrics}}}

  Generate a complete report.`,
});

const conductResearchFlow = ai.defineFlow(
  {
    name: 'conductResearchFlow',
    inputSchema: ConductResearchInputSchema,
    outputSchema: ConductResearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
