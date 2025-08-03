'use server';

/**
 * @fileOverview AI-powered market trend analysis flow.
 *
 * - analyzeMarketTrends - Analyzes cryptocurrency market trends to identify optimal trading opportunities.
 * - AnalyzeMarketTrendsInput - The input type for the analyzeMarketTrends function.
 * - AnalyzeMarketTrendsOutput - The return type for the analyzeMarketTrends function.
 */

import {ai} from '@/ai/genkit';
import { getCryptoMarketData } from '../tools/crypto-data-tool';
import {z} from 'genkit';

const AnalyzeMarketTrendsInputSchema = z.object({
  cryptocurrency: z.string().describe('The cryptocurrency to analyze (e.g., BTC, ETH).'),
  analysisType: z
    .enum(['buy', 'sell'])
    .describe('The type of analysis to perform: buy or sell.'),
});
export type AnalyzeMarketTrendsInput = z.infer<typeof AnalyzeMarketTrendsInputSchema>;

const AnalyzeMarketTrendsOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('The AI recommendation for the given cryptocurrency and analysis type.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the recommendation.'),
  reasoning: z.string().describe('The reasoning behind the AI recommendation.'),
});
export type AnalyzeMarketTrendsOutput = z.infer<typeof AnalyzeMarketTrendsOutputSchema>;

export async function analyzeMarketTrends(input: AnalyzeMarketTrendsInput): Promise<AnalyzeMarketTrendsOutput> {
  return analyzeMarketTrendsFlow(input);
}

const analyzeMarketTrendsPrompt = ai.definePrompt({
  name: 'analyzeMarketTrendsPrompt',
  input: {schema: z.object({
    cryptocurrency: z.string(),
    analysisType: z.enum(['buy', 'sell']),
    marketData: z.string(),
  })},
  output: {schema: AnalyzeMarketTrendsOutputSchema},
  tools: [getCryptoMarketData],
  prompt: `You are an AI cryptocurrency market analyst. Analyze the provided real-time market data for {{cryptocurrency}} and provide a recommendation on whether to {{analysisType}}. Justify your recommendation with clear reasoning and provide a confidence score between 0 and 1.
All responses must be in Russian.

Analysis Type: {{analysisType}}
Real-time Market Data: {{{marketData}}}`,
});

const analyzeMarketTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeMarketTrendsFlow',
    inputSchema: AnalyzeMarketTrendsInputSchema,
    outputSchema: AnalyzeMarketTrendsOutputSchema,
  },
  async (input) => {
    const marketData = await getCryptoMarketData({ticker: input.cryptocurrency});

    const {output} = await analyzeMarketTrendsPrompt({
        ...input,
        marketData: JSON.stringify(marketData, null, 2),
    });
    return output!;
  }
);
