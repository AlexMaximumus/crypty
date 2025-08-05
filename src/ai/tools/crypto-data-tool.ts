'use server';
/**
 * @fileOverview A tool for fetching cryptocurrency market data using a public API.
 * This implementation uses the Kraken exchange via CCXT, which does not require API keys for public market data.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as ccxt from 'ccxt';

const CryptoMarketDataSchema = z.object({
  price: z.number().describe('Current price in USD.'),
  volume24h: z.number().describe('24-hour trading volume in the base currency.'),
  // The following fields are not reliably available from public endpoints without keys/specific APIs
  openInterest: z.number().optional().describe('Open interest in USD for derivatives.'),
  fundingRate: z.number().optional().describe('Current funding rate for perpetual swaps.'),
  fearAndGreedIndex: z
    .object({
      value: z.number(),
      value_classification: z.string(),
    })
    .optional()
    .describe('Fear & Greed Index data.'),
});
export type CryptoMarketData = z.infer<typeof CryptoMarketDataSchema>;

// Use Kraken as it has reliable public endpoints
const exchange = new ccxt.kraken();

export const getCryptoMarketData = ai.defineTool(
  {
    name: 'getCryptoMarketData',
    description: 'Retrieves the latest market data for a given cryptocurrency using the Kraken public API.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
    }),
    outputSchema: CryptoMarketDataSchema,
  },
  async (input) => {
    try {
      console.log(`[Tool] Fetching real market data for ${input.ticker} from Kraken`);
      const ticker = `${input.ticker.toUpperCase()}/USDT`;
      const marketData = await exchange.fetchTicker(ticker);
      
      return {
        price: marketData.last || 0,
        volume24h: marketData.baseVolume || 0,
      };
    } catch (error) {
      console.error(`[Tool Error] Could not fetch market data for ${input.ticker}:`, error);
      // Return empty/default data on failure to prevent crashes
      return {
        price: 0,
        volume24h: 0,
      }
    }
  }
);


const CandlestickDataSchema = z.array(z.object({
  timestamp: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
}));

export const getCandlestickData = ai.defineTool(
  {
    name: 'getCandlestickData',
    description: 'Retrieves historical candlestick (OHLCV) data for a given cryptocurrency using the Kraken public API.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
      interval: z.string().describe('The time interval for candlesticks (e.g., 1h, 4h, 1d).'),
      limit: z.number().optional().default(100).describe('The number of candlesticks to retrieve.'),
    }),
    outputSchema: CandlestickDataSchema,
  },
  async (input) => {
    try {
        console.log(`[Tool] Fetching real candlestick data for ${input.ticker} (${input.interval}) from Kraken`);
        const ticker = `${input.ticker.toUpperCase()}/USDT`;
        // CCXT returns [timestamp, open, high, low, close, volume]
        const ohlcv = await exchange.fetchOHLCV(ticker, input.interval, undefined, input.limit);
        return ohlcv.map(candle => ({
            timestamp: candle[0],
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5],
        }));
    } catch (error) {
        console.error(`[Tool Error] Could not fetch candlestick data for ${input.ticker}:`, error);
        // Return empty array on failure
        return [];
    }
  }
);
