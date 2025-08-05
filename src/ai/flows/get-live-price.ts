'use server';

/**
 * @fileOverview Establishes a WebSocket connection to Kraken to get real-time price updates.
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
        const existing = connections.get(crypto);
        if(existing && existing.ws.readyState === WebSocket.OPEN) {
            return; // Connection is already active
        } else if (existing) {
            existing.ws.terminate();
            connections.delete(crypto);
        }
    }

    const ws = new WebSocket('wss://ws.kraken.com');
    const pair = `${crypto.toUpperCase()}/USDT`;

    const connectionState = {
        ws,
        lastPrice: 0,
        lastUpdate: Date.now()
    };
    connections.set(crypto, connectionState);

    ws.on('open', () => {
        console.log(`WebSocket opened for ${crypto} with Kraken.`);
        ws.send(JSON.stringify({
            event: 'subscribe',
            pair: [pair],
            subscription: {
                name: 'ticker'
            }
        }));
    });

    ws.on('message', (data: WebSocket.Data) => {
        const message = JSON.parse(data.toString());
        // Check if it's a ticker update and not a heartbeat or system status
        if (Array.isArray(message) && message[1]?.c) {
            const price = parseFloat(message[1].c[0]);
            if (!isNaN(price)) {
                connectionState.lastPrice = price;
                connectionState.lastUpdate = Date.now();
            }
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
    const cleanupInterval = 30000;
    const timeout = 60000;
    const intervalId = setInterval(() => {
        connections.forEach((conn, key) => {
            if (Date.now() - conn.lastUpdate > timeout) {
                conn.ws.terminate();
                connections.delete(key);
                console.log(`Closed inactive WebSocket for ${key}`);
            }
        });
        if (connections.size === 0) {
            clearInterval(intervalId);
        }
    }, cleanupInterval);
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
    
    // Only setup a new websocket if one doesn't exist or is not open
    const existingConn = connections.get(cryptocurrency);
    if (!existingConn || existingConn.ws.readyState !== WebSocket.OPEN) {
        setupWebSocket(cryptocurrency);
        // Give it a moment to connect and receive the first price
        await new Promise(resolve => setTimeout(resolve, 500)); 
    }
    
    const price = getPriceForCrypto(cryptocurrency);
    return { price };
  }
);
