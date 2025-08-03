'use server';

/**
 * @fileOverview Provides a daily cryptocurrency trading idea.
 *
 * - getDailyTradeIdea - A function that returns a concrete trading idea.
 * - DailyTradeIdeaInput - The input type for the getDailyTradeIdea function.
 * - DailyTradeIdeaOutput - The return type for the getDailyTradeIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyTradeIdeaInputSchema = z.object({
  // No input needed for this flow yet
});
export type DailyTradeIdeaInput = z.infer<typeof DailyTradeIdeaInputSchema>;

const DailyTradeIdeaOutputSchema = z.object({
  cryptocurrency: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
  recommendation: z.enum(['buy', 'sell']).describe('The trading recommendation: buy or sell.'),
  entryPrice: z.number().describe('The suggested entry price for the trade.'),
  targetPrice: z.number().describe('The suggested target price to sell/buy back.'),
  reasoning: z.string().describe('A brief, clear reasoning for the trade recommendation.'),
  confidenceScore: z.number().min(0).max(1).describe('The confidence score for this trade idea, from 0 to 1.'),
});
export type DailyTradeIdeaOutput = z.infer<typeof DailyTradeIdeaOutputSchema>;

export async function getDailyTradeIdea(input: DailyTradeIdeaInput): Promise<DailyTradeIdeaOutput> {
  return getDailyTradeIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDailyTradeIdeaPrompt',
  input: {schema: DailyTradeIdeaInputSchema},
  output: {schema: DailyTradeIdeaOutputSchema},
  prompt: `You are an expert cryptocurrency analyst. Your task is to provide a single, actionable, and concrete trading idea for today.
  All responses must be in Russian.
  
  Based on the current (simulated) market conditions, identify one cryptocurrency that has a high potential for a short-term move.
  Provide a clear "buy" or "sell" recommendation.
  Specify a concrete entry price and a target price.
  Give a concise reasoning for your recommendation.
  Provide a confidence score between 0 and 1.

  Example Output:
  - Cryptocurrency: "BTC"
  - Recommendation: "buy"
  - Entry Price: 68500
  - Target Price: 71000
  - Reasoning: "Цена BTC консолидируется выше ключевого уровня поддержки. Ожидается прорыв вверх на фоне позитивных новостей."
  - Confidence Score: 0.85

  Generate a new, unique trading idea now.`,
});

const getDailyTradeIdeaFlow = ai.defineFlow(
  {
    name: 'getDailyTradeIdeaFlow',
    inputSchema: DailyTradeIdeaInputSchema,
    outputSchema: DailyTradeIdeaOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
