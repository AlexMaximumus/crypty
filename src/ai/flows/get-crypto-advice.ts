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
  prompt: `You are a helpful AI assistant specializing in cryptocurrency trading, wallet setup, and fund management.

  Provide clear, concise, and accurate advice based on the user's query.

  Query: {{{query}}}`,
});

const getCryptoAdviceFlow = ai.defineFlow(
  {
    name: 'getCryptoAdviceFlow',
    inputSchema: GetCryptoAdviceInputSchema,
    outputSchema: GetCryptoAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
