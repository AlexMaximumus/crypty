'use server';

/**
 * @fileOverview This file defines a Genkit flow for receiving smart alerts about potential profitable trades in cryptocurrency.
 *
 * - receiveSmartAlerts - A function that initiates the process of generating and delivering smart alerts.
 * - SmartAlertsInput - The input type for the receiveSmartAlerts function.
 * - SmartAlertsOutput - The return type for the receiveSmartAlerts function.
 */

import {ai} from '@/ai/genkit';
import { getCryptoMarketData } from '../tools/crypto-data-tool';
import {z} from 'genkit';

const SmartAlertsInputSchema = z.object({
    cryptocurrency: z.string().describe('The cryptocurrency to get an alert for (e.g. BTC, ETH)'),
    userData: z
        .string()
        .describe(
        'The user preferences, risk tolerance, and trading history. in JSON format'
        ),
});
export type SmartAlertsInput = z.infer<typeof SmartAlertsInputSchema>;

const SmartAlertsOutputSchema = z.object({
  alertMessage: z
    .string()
    .describe(
      'A message containing the smart alert, including the cryptocurrency, suggested action (buy/sell), and rationale.'
    ),
  confidenceLevel: z
    .number()
    .describe(
      'A numerical value (0-1) representing the confidence level of the alert, based on the reliability of the data sources and analysis.'
    ),
});
export type SmartAlertsOutput = z.infer<typeof SmartAlertsOutputSchema>;

export async function receiveSmartAlerts(
  input: SmartAlertsInput
): Promise<SmartAlertsOutput> {
  return receiveSmartAlertsFlow(input);
}

const smartAlertsPrompt = ai.definePrompt({
  name: 'smartAlertsPrompt',
  tools: [getCryptoMarketData],
  input: {schema: z.object({
    cryptocurrency: z.string(),
    marketData: z.string(),
    userData: z.string(),
  })},
  output: {schema: SmartAlertsOutputSchema},
  prompt: `You are an AI-powered cryptocurrency trading assistant.
All responses must be in Russian.

  Analyze the provided real-time market data to generate a smart alert for a potential profitable trade in {{cryptocurrency}}. Take into account the user's risk tolerance from their user data. Be concise.

  Real-time Market Data: {{{marketData}}}
  User Data: {{{userData}}}

  Provide an alert message with the cryptocurrency, suggested action (buy/sell), and rationale.
  Also, provide a confidence level (0-1) for the alert.
  `,
});

const receiveSmartAlertsFlow = ai.defineFlow(
  {
    name: 'receiveSmartAlertsFlow',
    inputSchema: SmartAlertsInputSchema,
    outputSchema: SmartAlertsOutputSchema,
  },
  async (input) => {
    const marketData = await getCryptoMarketData({ticker: input.cryptocurrency});
    
    const {output} = await smartAlertsPrompt({
        ...input,
        marketData: JSON.stringify(marketData, null, 2),
    });

    return output!;
  }
);
