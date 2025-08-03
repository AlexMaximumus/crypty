'use server';
/**
 * @fileOverview A tool for fetching cryptocurrency market data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CryptoMarketDataSchema = z.object({
  price: z.number().describe('Current price in USD.'),
  volume24h: z.number().describe('24-hour trading volume in USD.'),
  openInterest: z.number().describe('Open interest in USD.'),
  fundingRate: z.number().describe('Current funding rate.'),
  fearAndGreedIndex: z
    .object({
      value: z.number(),
      value_classification: z.string(),
    })
    .describe('Fear & Greed Index data.'),
});

export const getCryptoMarketData = ai.defineTool(
  {
    name: 'getCryptoMarketData',
    description: 'Retrieves the latest market data for a given cryptocurrency.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
    }),
    outputSchema: CryptoMarketDataSchema,
  },
  async (input) => {
    console.log(`[Tool] Fetching market data for ${input.ticker}`);
    // In a real application, you would fetch data from a real API like Binance, KuCoin, or Glassnode.
    // For this example, we'll return mock data.
    const basePrice = input.ticker === 'ETH' ? 3500 : 68000;
    const price = basePrice + (Math.random() - 0.5) * 1000;
    
    return {
      price: parseFloat(price.toFixed(2)),
      volume24h: Math.random() * 50_000_000_000,
      openInterest: Math.random() * 20_000_000_000,
      fundingRate: (Math.random() - 0.2) * 0.01,
      fearAndGreedIndex: {
        value: Math.floor(Math.random() * 101),
        value_classification: ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'][Math.floor(Math.random() * 5)],
      },
    };
  }
);
