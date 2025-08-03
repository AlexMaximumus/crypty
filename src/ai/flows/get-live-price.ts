'use server';

/**
 * @fileOverview Establishes a WebSocket connection to Binance to get real-time price updates.
 *
 * - getLivePrice - A function that returns the latest price for a cryptocurrency.
 * - LivePriceInput - The input type for the getLivePrice function.
 * - LivePriceOutput - The return type for the getLivePrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import WebSocket from 'ws';

const LivePriceInputSchema = z.object({
    cryptocurrency: z.string().describe('The cryptocurrency to get the live price for (e.g., BTC, ETH).'),
});
export type LivePriceInput = z.infer<typeof LivePriceInputSchema>;

const LivePriceOutputSchema = z.object({
    price: z.number().optional().describe('The latest price of the cryptocurrency.'),
});
export type LivePriceOutput = z.infer<typeof LivePriceOutputSchema>;


let connections: Map<string, { ws: WebSocket, lastPrice: number, lastUpdate: number }> = new Map();

function getPriceForCrypto(crypto: string): number | undefined {
    return connections.get(crypto)?.lastPrice;
}

function setupWebSocket(crypto: string) {
    if (connections.has(crypto)) {
        // cleanup old connection if it's not open
        const existing = connections.get(crypto);
        if(existing && existing.ws.readyState !== WebSocket.OPEN) {
            existing.ws.terminate();
            connections.delete(crypto);
        } else {
            return;
        }
    }

    const streamName = `${crypto.toLowerCase()}usdt@trade`;
    const ws = new WebSocket(`wss://stream.binance.com:443/ws/${streamName}`);

    const connectionState = {
        ws,
        lastPrice: 0,
        lastUpdate: Date.now()
    };
    connections.set(crypto, connectionState);

    ws.on('message', (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        if (message.e === 'trade' && message.p) {
            connectionState.lastPrice = parseFloat(message.p);
            connectionState.lastUpdate = Date.now();
        }
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for ${crypto}:`, error);
        ws.terminate();
        connections.delete(crypto);
    });

    ws.on('close', () => {
        console.log(`WebSocket closed for ${crypto}`);
        connections.delete(crypto);
    });

    // Cleanup inactive connections
    setInterval(() => {
        connections.forEach((conn, key) => {
            if (Date.now() - conn.lastUpdate > 60000) { // 1 minute timeout
                conn.ws.terminate();
                connections.delete(key);
                console.log(`Closed inactive WebSocket for ${key}`);
            }
        });
    }, 30000);
}


export async function getLivePrice(input: LivePriceInput): Promise<LivePriceOutput> {
  return getLivePriceFlow(input);
}


const getLivePriceFlow = ai.defineFlow(
  {
    name: 'getLivePriceFlow',
    inputSchema: LivePriceInputSchema,
    outputSchema: LivePriceOutputSchema,
  },
  async (input) => {
    const { cryptocurrency } = input;
    if (!connections.has(cryptocurrency)) {
        setupWebSocket(cryptocurrency);
    }
    
    // Give it a moment to connect and receive the first price
    await new Promise(resolve => setTimeout(resolve, 250)); 
    
    const price = getPriceForCrypto(cryptocurrency);
    return { price };
  }
);
