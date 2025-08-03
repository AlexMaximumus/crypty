'use server';

/**
 * @fileOverview Performs automated technical analysis using candlestick data.
 *
 * - getTechnicalAnalysis - A function that returns a trading recommendation based on technical indicators.
 * - TechnicalAnalysisInput - The input type for the getTechnicalAnalysis function.
 * - TechnicalAnalysisOutput - The return type for the getTechnicalAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { getCandlestickData } from '@/ai/tools/crypto-data-tool';
import { z } from 'genkit';

const TechnicalAnalysisInputSchema = z.object({
  cryptocurrency: z.string().describe('The cryptocurrency to analyze (e.g., BTC, ETH).'),
  interval: z.string().describe('The time interval for the analysis (e.g., 1h, 4h, 1d).'),
});
export type TechnicalAnalysisInput = z.infer<typeof TechnicalAnalysisInputSchema>;

const CandlestickDataPointSchema = z.object({
    timestamp: z.number(),
    open: z.number(),
    high: z.number(),
    low: z.number(),
    close: z.number(),
    volume: z.number(),
});

const TechnicalAnalysisOutputSchema = z.object({
  recommendation: z.enum(['Buy', 'Sell', 'Hold']).describe('The trading recommendation: Buy, Sell, or Hold.'),
  reasoning: z.string().describe('Detailed reasoning for the recommendation, citing specific indicators and price action.'),
  confidenceScore: z.number().min(0).max(1).describe('The confidence score for this recommendation, from 0 to 1.'),
  candlestickData: z.array(CandlestickDataPointSchema).describe('The candlestick data used for the analysis.'),
});
export type TechnicalAnalysisOutput = z.infer<typeof TechnicalAnalysisOutputSchema>;


export async function getTechnicalAnalysis(input: TechnicalAnalysisInput): Promise<TechnicalAnalysisOutput> {
  return getTechnicalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'technicalAnalysisPrompt',
  input: {
    schema: z.object({
        cryptocurrency: z.string(),
        interval: z.string(),
        candlestickData: z.string(),
    })
  },
  output: {
    schema: z.object({
        recommendation: z.enum(['Buy', 'Sell', 'Hold']),
        reasoning: z.string(),
        confidenceScore: z.number().min(0).max(1),
    })
  },
  tools: [getCandlestickData],
  prompt: `You are an expert technical analyst for the cryptocurrency market. Your task is to analyze the provided candlestick data for {{cryptocurrency}} on the {{interval}} timeframe and provide a clear trading recommendation.

All responses must be in Russian.

Analyze the provided OHLCV data to identify key patterns, trends, support and resistance levels. Evaluate common technical indicators like Moving Averages (e.g., 20-period, 50-period) and RSI (Relative Strength Index).

Based on your comprehensive analysis, provide:
1.  A clear recommendation: "Buy", "Sell", or "Hold".
2.  Detailed, step-by-step reasoning for your recommendation. Mention specific price levels, indicator values, and candlestick patterns you are observing.
3.  A confidence score between 0 and 1.

Candlestick Data (JSON format):
{{{candlestickData}}}
`,
});

const getTechnicalAnalysisFlow = ai.defineFlow(
  {
    name: 'getTechnicalAnalysisFlow',
    inputSchema: TechnicalAnalysisInputSchema,
    outputSchema: TechnicalAnalysisOutputSchema,
  },
  async (input) => {
    const candlestickData = await getCandlestickData({ 
        ticker: input.cryptocurrency,
        interval: input.interval,
        limit: 100, // Fetch 100 candles for analysis
    });

    const analysisResult = await prompt({
      ...input,
      candlestickData: JSON.stringify(candlestickData, null, 2),
    });

    const { output } = analysisResult;

    if (!output) {
      throw new Error("AI analysis failed to produce a result.");
    }
    
    return {
        ...output,
        candlestickData: candlestickData,
    };
  }
);
