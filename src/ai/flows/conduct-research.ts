'use server';

/**
 * @fileOverview Conducts automated research based on provided market data.
 *
 * - conductResearch - A function that performs a comprehensive market analysis.
 * - ConductResearchInput - The input type for the conductResearch function.
 * - ConductResearchOutput - The return type for the conductResearch function.
 */

import {ai} from '@/ai/genkit';
import { getCryptoMarketData } from '../tools/crypto-data-tool';
import {z} from 'genkit';

const ConductResearchInputSchema = z.object({
  cryptocurrency: z.string().describe('The cryptocurrency to analyze (e.g., BTC, ETH).'),
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
  input: {schema: z.object({
    cryptocurrency: z.string(),
    marketData: z.string(),
  })},
  output: {schema: ConductResearchOutputSchema},
  tools: [getCryptoMarketData],
  prompt: `You are a professional cryptocurrency analyst. Your task is to conduct a comprehensive automated research for {{cryptocurrency}} based on the real-time data provided by the getCryptoMarketData tool. Structure your analysis into the following sections: Summary, Market Analysis, On-Chain Analysis, Technical Analysis, and Sentiment Analysis.
All responses must be in Russian.

  Provide a clear trading recommendation (Buy, Sell, or Hold) and a confidence score. Be thorough, data-driven, and objective in your analysis.

  Data Provided by getCryptoMarketData tool:
  - Cryptocurrency: {{cryptocurrency}}
  - Real-time Data: {{{marketData}}}

  Generate a complete report.`,
});

const conductResearchFlow = ai.defineFlow(
  {
    name: 'conductResearchFlow',
    inputSchema: ConductResearchInputSchema,
    outputSchema: ConductResearchOutputSchema,
  },
  async (input) => {
    const marketData = await getCryptoMarketData({ticker: input.cryptocurrency});

    const {output} = await prompt({
        ...input,
        marketData: JSON.stringify(marketData, null, 2),
    });
    return output!;
  }
);
