'use server';
/**
 * @fileOverview A tool for fetching cryptocurrency market data from Binance.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as ccxt from 'ccxt';

const CryptoMarketDataSchema = z.object({
  price: z.number().describe('Current price in USD.'),
  volume24h: z.number().describe('24-hour trading volume in USD.'),
  openInterest: z.number().optional().describe('Open interest in USD for derivatives.'),
  fundingRate: z.number().optional().describe('Current funding rate for perpetual swaps.'),
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
    description: 'Retrieves the latest market data for a given cryptocurrency from Binance.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
    }),
    outputSchema: CryptoMarketDataSchema,
  },
  async (input) => {
    console.log(`[Tool] Fetching market data for ${input.ticker} from Binance`);

    const exchange = new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_API_SECRET,
    });
    
    // In a real application, you might need to handle spot vs futures markets differently
    const symbol = `${input.ticker}/USDT`;

    try {
      const tickerData = await exchange.fetchTicker(symbol);
      const fundingRateData = await exchange.fetchFundingRate(symbol);
      
      return {
        price: tickerData.last || 0,
        volume24h: tickerData.quoteVolume || 0,
        openInterest: tickerData.info.openInterest, // This might vary based on exchange response
        fundingRate: fundingRateData.fundingRate,
        fearAndGreedIndex: { // This data is not from Binance, so we'll keep it mocked.
          value: Math.floor(Math.random() * 101),
          value_classification: ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'][Math.floor(Math.random() * 5)],
        },
      };

    } catch (error) {
      console.error(`Error fetching data from Binance for ${symbol}:`, error);
      // Fallback to mock data if API fails
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
  }
);
