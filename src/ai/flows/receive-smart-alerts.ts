// src/ai/flows/receive-smart-alerts.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for receiving smart alerts about potential profitable trades in cryptocurrency.
 *
 * - receiveSmartAlerts - A function that initiates the process of generating and delivering smart alerts.
 * - SmartAlertsInput - The input type for the receiveSmartAlerts function.
 * - SmartAlertsOutput - The return type for the receiveSmartAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartAlertsInputSchema = z.object({
  marketAnalysis: z
    .string()
    .describe('The cryptocurrency market analysis data.'),
  historicalData: z
    .string()
    .describe('Historical price and volume data for cryptocurrencies.'),
  technicalIndicators: z
    .string()
    .describe('Technical indicators such as RSI, MACD, etc.'),
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

const analyzeDataSourceReliability = ai.defineTool({
  name: 'analyzeDataSourceReliability',
  description:
    'Analyzes the reliability of data sources for cryptocurrency market data.',
  inputSchema: z.object({
    sourceName: z.string().describe('The name of the data source.'),
    dataSample: z.string().describe('A sample of data from the source.'),
  }),
  outputSchema: z
    .number()
    .describe(
      'A numerical score (0-1) representing the reliability of the data source.'
    ),
}, async (input) => {
  // Mock implementation - replace with actual reliability analysis logic
  console.log(
    `Running analyzeDataSourceReliability tool with source ${input.sourceName}`
  );
  return Math.random(); // Return a random number for demonstration purposes
});

export async function receiveSmartAlerts(
  input: SmartAlertsInput
): Promise<SmartAlertsOutput> {
  return receiveSmartAlertsFlow(input);
}

const smartAlertsPrompt = ai.definePrompt({
  name: 'smartAlertsPrompt',
  tools: [analyzeDataSourceReliability],
  input: {schema: SmartAlertsInputSchema},
  output: {schema: SmartAlertsOutputSchema},
  prompt: `You are an AI-powered cryptocurrency trading assistant.
All responses must be in Russian.

  Analyze the provided market data, historical data, technical indicators, and user data to generate smart alerts for potential profitable trades. Take into account the users risk tolerance. Be concise.

  Market Analysis: {{{marketAnalysis}}}
  Historical Data: {{{historicalData}}}
  Technical Indicators: {{{technicalIndicators}}}
  User Data: {{{userData}}}

  Consider the reliability of data sources using the 'analyzeDataSourceReliability' tool.

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
  async input => {
    const {output} = await smartAlertsPrompt(input);
    return output!;
  }
);
