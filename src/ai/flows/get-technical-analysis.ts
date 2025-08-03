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

const AnalysisBreakdownSchema = z.object({
    candlestickPatterns: z.string().describe("Analysis of specific candlestick patterns observed on the chart."),
    trendAnalysis: z.string().describe("Analysis of the current price trend (e.g., using moving averages)."),
    indicatorAnalysis: z.string().describe("Analysis of key technical indicators like RSI, MACD etc."),
    supportResistance: z.string().describe("Analysis of the identified key support and resistance levels."),
    volumeAnalysis: z.string().describe("Analysis of trading volumes and what they indicate."),
});

const TechnicalAnalysisOutputSchema = z.object({
  recommendation: z.enum(['Buy', 'Sell', 'Hold']).describe('The trading recommendation: Buy, Sell, or Hold.'),
  summary: z.string().describe('A simple, one-sentence summary of the recommendation.'),
  confidenceScore: z.number().min(0).max(1).describe('The confidence score for this recommendation, from 0 to 1.'),
  candlestickData: z.array(CandlestickDataPointSchema).describe('The candlestick data used for the analysis.'),
  supportLevel: z.number().optional().describe('The identified key support level.'),
  resistanceLevel: z.number().optional().describe('The identified key resistance level.'),
  analysisBreakdown: AnalysisBreakdownSchema.describe("A detailed, step-by-step breakdown of the analysis."),
  movingAverage: z.array(z.object({timestamp: z.number(), value: z.number()})).optional().describe("Calculated moving average data points."),
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
        summary: z.string().describe('Простой, односложный итог рекомендации. Например: "Цена показывает признаки силы, рекомендуется покупка."'),
        confidenceScore: z.number().min(0).max(1),
        supportLevel: z.number().optional().describe('Самый значимый уровень поддержки на основе данных.'),
        resistanceLevel: z.number().optional().describe('Самый значимый уровень сопротивления на основе данных.'),
        analysisBreakdown: AnalysisBreakdownSchema.describe("Подробный, пошаговый разбор анализа для новичков."),
    })
  },
  tools: [getCandlestickData],
  prompt: `You are an expert technical analyst for the cryptocurrency market. Your task is to analyze the provided candlestick data for {{cryptocurrency}} on the {{interval}} timeframe and provide a clear, simple, and actionable trading recommendation for a complete beginner.

All responses must be in Russian. Explain everything as if you are talking to someone who knows nothing about trading.

Analyze the provided OHLCV data. Identify key patterns, trends, support/resistance levels, and evaluate common technical indicators like Moving Averages (20-period) and RSI.

Based on your comprehensive analysis, provide:
1.  **A clear recommendation**: "Buy", "Sell", or "Hold".
2.  **A simple summary**: A one-sentence, easy-to-understand conclusion.
3.  **A confidence score**: Between 0 and 1.
4.  **The most important Support Level**: The price where it's good to buy.
5.  **The most important Resistance Level**: The price where it's good to sell.
6.  **A detailed analysis breakdown for a beginner**:
    - **candlestickPatterns**: "Что я вижу на свечном графике? Я вижу модель 'Бычье поглощение', это хороший знак."
    - **trendAnalysis**: "Куда идет тренд? Цена находится выше 20-периодной скользящей средней, это говорит о восходящем тренде."
    - **indicatorAnalysis**: "Что говорят индикаторы? Индекс RSI ниже 70, значит, актив еще не 'перекуплен'."
    - **supportResistance**: "Где ключевые уровни? Сильная поддержка на $50000, где много раз покупали. Сопротивление на $55000, где начинают продавать."
    - **volumeAnalysis**: "Что с объемами торгов? Я вижу рост объемов на зеленых свечах, это подтверждает силу покупателей."

Candlestick Data (JSON format):
{{{candlestickData}}}
`,
});

// Helper function to calculate Simple Moving Average (SMA)
function calculateSMA(data: any[], period: number) {
    if (!data || data.length < period) {
        return [];
    }
    const sma = [];
    for (let i = period - 1; i < data.length; i++) {
        const subset = data.slice(i - period + 1, i + 1);
        const sum = subset.reduce((acc, val) => acc + val.close, 0);
        sma.push({
            timestamp: data[i].timestamp,
            value: sum / period,
        });
    }
    return sma;
}


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
    
    // Calculate 20-period SMA
    const movingAverage = calculateSMA(candlestickData, 20);

    return {
        ...output,
        candlestickData: candlestickData,
        movingAverage: movingAverage,
    };
  }
);
