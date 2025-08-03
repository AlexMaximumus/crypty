'use server';

/**
 * @fileOverview A cryptocurrency trading assistant AI agent.
 *
 * - getCryptoAdvice - A function that provides advice on cryptocurrency trading, wallet setup, and fund management.
 * - GetCryptoAdviceInput - The input type for the getCryptoAdvice function.
 * - GetCryptoAdviceOutput - The return type for the getCryptoAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getDailyTradeIdeaFlow } from './get-daily-trade-idea';
import { getCryptoRatingFlow } from './get-crypto-rating';
import { getTechnicalAnalysisFlow } from './get-technical-analysis';

const GetCryptoAdviceInputSchema = z.object({
  query: z.string().describe('The user query about cryptocurrency trading, wallet setup, or fund management.'),
});
export type GetCryptoAdviceInput = z.infer<typeof GetCryptoAdviceInputSchema>;

const GetCryptoAdviceOutputSchema = z.object({
  advice: z.string().describe('The advice provided by the AI assistant.'),
});
export type GetCryptoAdviceOutput = z.infer<typeof GetCryptoAdviceOutputSchema>;

export async function getCryptoAdvice(input: GetCryptoAdviceInput): Promise<GetCryptoAdviceOutput> {
  return getCryptoAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCryptoAdvicePrompt',
  input: {schema: GetCryptoAdviceInputSchema},
  output: {schema: GetCryptoAdviceOutputSchema},
  tools: [getDailyTradeIdeaFlow, getCryptoRatingFlow, getTechnicalAnalysisFlow],
  prompt: `You are a helpful and very powerful AI assistant specializing in cryptocurrency trading.
All responses must be in Russian.

Your primary goal is to provide clear, concise, actionable and data-driven advice.

When a user asks for a recommendation, a trade idea, or a direct question like "what should I buy?", you MUST use the provided tools to get real-time data and analysis. Do not provide generic or speculative answers.

- If asked for a "trade idea", use the getDailyTradeIdea tool.
- If asked for a comparison or "rating", use the getCryptoRating tool.
- If asked for "technical analysis", use the getTechnicalAnalysis tool.

Base your final response on the output of the tools.

Query: {{{query}}}`,
});

const getCryptoAdviceFlow = ai.defineFlow(
  {
    name: 'getCryptoAdviceFlow',
    inputSchema: GetCryptoAdviceInputSchema,
    outputSchema: GetCryptoAdviceOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const toolResponse = llmResponse.toolRequest;

    if (toolResponse) {
        console.log('Tool request:', toolResponse);
    }
    
    const {output} = llmResponse;
    return output!;
  }
);
