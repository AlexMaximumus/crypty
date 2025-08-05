'use server';
/**
 * @fileOverview A tool for fetching cryptocurrency market data.
 * This implementation uses mock data to ensure functionality without API keys.
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
export type CryptoMarketData = z.infer<typeof CryptoMarketDataSchema>;

function generateMockMarketData(ticker: string) {
    console.log(`[Tool] Generating mock market data for ${ticker}`);
    const basePrices: { [key: string]: number } = {
        'BTC': 68000,
        'ETH': 3500,
        'SOL': 150,
        'XRP': 0.5,
        'DOGE': 0.15,
    };
    const basePrice = basePrices[ticker] || 50000;
    const price = basePrice + (Math.random() - 0.5) * (basePrice * 0.05);
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

export const getCryptoMarketData = ai.defineTool(
  {
    name: 'getCryptoMarketData',
    description: 'Retrieves the latest market data for a given cryptocurrency using reliable mock data.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
    }),
    outputSchema: CryptoMarketDataSchema,
  },
  async (input) => {
    // This tool now exclusively uses mock data generation for reliability.
    return generateMockMarketData(input.ticker);
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

function generateMockCandlestickData(ticker: string, interval: string, limit: number) {
    console.log(`[Tool] Generating mock candlestick data for ${ticker} (${interval})`);
    const data = [];
    const basePrices: { [key: string]: number } = {
        'BTC': 68000,
        'ETH': 3500,
        'SOL': 150,
        'XRP': 0.5,
        'DOGE': 0.15,
    };
    let lastClose = basePrices[ticker] || 50000;
    lastClose += (Math.random() - 0.5) * (lastClose * 0.2); // Initial random deviation

    const now = Date.now();
    const intervalInSeconds = interval.endsWith('h') ? parseInt(interval) * 3600 : interval.endsWith('d') ? parseInt(interval) * 86400 : 3600;
    const intervalMs = intervalInSeconds * 1000;

    for (let i = 0; i < limit; i++) {
        const timestamp = now - (limit - 1 - i) * intervalMs;
        const open = lastClose;
        const close = open + (Math.random() - 0.5) * (open * 0.05); // 5% volatility
        const high = Math.max(open, close) * (1 + Math.random() * 0.02); // 2% wick
        const low = Math.min(open, close) * (1 - Math.random() * 0.02); // 2% wick
        const volume = Math.random() * 1000 + 100; // Realistic volume
        data.push({
          timestamp,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: parseFloat(volume.toFixed(2)),
        });
        lastClose = close;
    }
    return data;
}

export const getCandlestickData = ai.defineTool(
  {
    name: 'getCandlestickData',
    description: 'Retrieves historical candlestick (OHLCV) data for a given cryptocurrency using reliable mock data.',
    inputSchema: z.object({
      ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
      interval: z.string().describe('The time interval for candlesticks (e.g., 1h, 4h, 1d).'),
      limit: z.number().optional().default(100).describe('The number of candlesticks to retrieve.'),
    }),
    outputSchema: CandlestickDataSchema,
  },
  async (input) => {
    // This tool now exclusively uses mock data generation for reliability.
    return generateMockCandlestickData(input.ticker, input.interval, input.limit || 100);
  }
);
