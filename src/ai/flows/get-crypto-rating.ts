'use server';

/**
 * @fileOverview Provides a comparative rating of multiple cryptocurrencies.
 *
 * - getCryptoRating - A function that returns a rating for several cryptocurrencies.
 * - CryptoRatingInput - The input type for the getCryptoRating function.
 * - CryptoRatingOutput - The return type for the getCryptoRating function.
 */

import {ai} from '@/ai/genkit';
import {getCryptoMarketData, type CryptoMarketData} from '@/ai/tools/crypto-data-tool';
import {z} from 'genkit';
import * as ccxt from 'ccxt';

const CryptoRatingInputSchema = z.object({
  cryptocurrencies: z.array(z.string()).describe('The cryptocurrencies to get a rating for (e.g., BTC, ETH).'),
});
export type CryptoRatingInput = z.infer<typeof CryptoRatingInputSchema>;

const SingleCryptoRatingSchema = z.object({
    symbol: z.string().describe("The ticker symbol of the cryptocurrency (e.g., BTC, ETH)."),
    rating: z.enum(['Very Bullish', 'Bullish', 'Neutral', 'Bearish', 'Very Bearish']).describe("The overall rating for the cryptocurrency's short-term potential."),
    price: z.number().describe("The current price of the cryptocurrency."),
    change24h: z.number().describe("The percentage price change in the last 24 hours."),
    summary: z.string().describe("A brief, clear summary explaining the rating, based on market data."),
    volume24h: z.number().describe("The 24-hour trading volume."),
});

const CryptoRatingOutputSchema = z.object({
  ratings: z.array(SingleCryptoRatingSchema).describe("An array of ratings for each requested cryptocurrency."),
});
export type CryptoRatingOutput = z.infer<typeof CryptoRatingOutputSchema>;


const prompt = ai.definePrompt({
  name: 'getCryptoRatingPrompt',
  input: {
    schema: z.object({
        marketData: z.string(),
    })
  },
  output: {schema: CryptoRatingOutputSchema},
  prompt: `You are an expert cryptocurrency market analyst. Your task is to provide a comparative rating for a list of cryptocurrencies based on the provided real-time market data.
  
  All responses must be in Russian.

  Analyze the data for each cryptocurrency. Assign a rating from "Very Bullish" to "Very Bearish" based on factors like price momentum, volume, and other available metrics.
  Provide a concise summary for each rating, explaining your reasoning in simple terms.

  The goal is to give a user a quick, high-level overview of the current market landscape to help them decide which asset to look into further.

  Real-time Market Data (JSON format):
  {{{marketData}}}
  `,
});

export const getCryptoRating = ai.defineTool(
  {
    name: 'getCryptoRating',
    description: 'Provides a comparative rating of multiple cryptocurrencies.',
    inputSchema: CryptoRatingInputSchema,
    outputSchema: CryptoRatingOutputSchema,
  },
  async (input) => {
    // This provides a default if the input is `getCryptoRating({})` or if the input is empty
    const cryptocurrencies = (input.cryptocurrencies && input.cryptocurrencies.length > 0) ? input.cryptocurrencies : ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'];
    const exchange = new (ccxt.kraken)();
    
    const marketDataPromises = cryptocurrencies.map(async (crypto) => {
      try {
        const ticker = `${crypto}/USDT`;
        const marketData = await exchange.fetchTicker(ticker);
        return {
          symbol: crypto,
          price: marketData.last || 0,
          volume24h: marketData.baseVolume || 0,
          change24h: marketData.change || 0,
        };
      } catch (error) {
        console.error(`Could not fetch data for ${crypto}:`, error);
        return { symbol: crypto, price: 0, volume24h: 0, change24h: 0 };
      }
    });

    const marketData = await Promise.all(marketDataPromises);
    
    const {output} = await prompt({
        marketData: JSON.stringify(marketData, null, 2),
    });

    if (!output) {
      throw new Error("AI rating failed to produce a result.");
    }

    // Augment the output with data that might not be perfectly returned by the model
    const augmentedRatings = output.ratings.map(rating => {
        const originalData = marketData.find(d => d.symbol === rating.symbol);
        return {
            ...rating,
            price: originalData?.price ?? rating.price,
            change24h: originalData?.change24h ?? rating.change24h,
            volume24h: originalData?.volume24h ?? rating.volume24h,
        }
    });

    return { ratings: augmentedRatings };
  }
);
