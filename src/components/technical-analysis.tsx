"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getTechnicalAnalysis, type TechnicalAnalysisOutput } from '@/ai/flows/get-technical-analysis';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Lightbulb, TrendingUp, TrendingDown, MinusCircle, CandlestickChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  cryptocurrency: z.string().min(1, "Выберите криптовалюту"),
  interval: z.string().min(1, "Выберите интервал"),
});

type CandlestickProps = {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    low: number;
    high: number;
    open: number;
    close: number;
};
  
const Candlestick = (props: CandlestickProps) => {
    const { x, y, width, height, low, high, open, close } = props;
    const isBullish = close > open;
    const fill = isBullish ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))';
    const wickFill = isBullish ? 'hsl(var(--chart-2) / 0.5)' : 'hsl(var(--chart-1) / 0.5)';
  
    return (
      <g stroke={fill} fill={fill} strokeWidth={1}>
        <path
          d={`M ${x + width / 2},${y} L ${x + width / 2},${y + height}`}
          stroke={wickFill}
        />
        <rect x={x} y={y} width={width} height={height} fill={fill} />
      </g>
    );
};


export function TechnicalAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TechnicalAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: 'BTC',
      interval: '1h',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await getTechnicalAnalysis(values);
      setResult(response);
    } catch (e) {
      setError("Не удалось провести технический анализ. Попробуйте позже.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  
  const recommendationIsBuy = result?.recommendation === 'Buy';
  const recommendationIsSell = result?.recommendation === 'Sell';

  const chartConfig = {
    price: {
        label: 'Цена',
    },
    volume: {
        label: 'Объем',
        color: 'hsl(var(--muted-foreground) / 0.3)',
    }
  } satisfies ChartConfig;

  return (
    <div className="grid gap-6">
       <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Параметры Анализа</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cryptocurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Криптовалюта</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Выберите валюту" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="SOL">Solana (SOL)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Интервал</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Выберите интервал" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1h">1 час</SelectItem>
                        <SelectItem value="4h">4 часа</SelectItem>
                        <SelectItem value="1d">1 день</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Анализ..." : "Получить рекомендацию"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card className="flex flex-col min-h-[500px]">
        <CardHeader>
          <CardTitle className="font-headline">Результат Анализа</CardTitle>
          <CardDescription>Здесь появится график и рекомендация от ИИ.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>ИИ анализирует свечи и индикаторы...</p>
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : result ? (
            <div className="w-full space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={result.candlestickData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                                    <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleDateString()} hide/>
                                    <YAxis yAxisId="left" orientation="left" domain={['dataMin - (dataMax - dataMin) * 0.1', 'dataMax + (dataMax - dataMin) * 0.1']} hide />
                                    <YAxis yAxisId="right" orientation="right" domain={['dataMin', 'dataMax * 5']} hide />
                                    <Tooltip content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="p-2 bg-background border rounded-lg shadow-lg">
                                                    <p className="text-sm text-muted-foreground">{new Date(data.timestamp).toLocaleString()}</p>
                                                    <p className="text-sm">Open: <span className="font-bold">{data.open.toFixed(2)}</span></p>
                                                    <p className="text-sm">High: <span className="font-bold">{data.high.toFixed(2)}</span></p>
                                                    <p className="text-sm">Low: <span className="font-bold">{data.low.toFixed(2)}</span></p>
                                                    <p className="text-sm">Close: <span className="font-bold">{data.close.toFixed(2)}</span></p>
                                                    <p className="text-sm">Volume: <span className="font-bold">{data.volume.toFixed(2)}</span></p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}/>
                                    <Bar dataKey="volume" yAxisId="right" fill="hsl(var(--muted-foreground) / 0.3)" barSize={10} />
                                    <Line
                                        dataKey="close"
                                        type="linear"
                                        yAxisId="left"
                                        strokeWidth={0}
                                        dot={false}
                                        activeDot={false}
                                        shape={(props: any) => <Candlestick {...props} />}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div className={cn('flex items-center gap-3 rounded-lg p-4 text-lg font-bold', 
                            recommendationIsBuy && 'bg-green-500/10 text-green-400',
                            recommendationIsSell && 'bg-red-500/10 text-red-400',
                            !recommendationIsBuy && !recommendationIsSell && 'bg-yellow-500/10 text-yellow-400'
                         )}>
                            {recommendationIsBuy && <TrendingUp className="h-6 w-6"/>}
                            {recommendationIsSell && <TrendingDown className="h-6 w-6"/>}
                            {!recommendationIsBuy && !recommendationIsSell && <MinusCircle className="h-6 w-6"/>}
                            <span>{result.recommendation}</span>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Уверенность: {Math.round(result.confidenceScore * 100)}%</h3>
                            <Progress value={result.confidenceScore * 100} />
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> Обоснование</h3>
                            <p className="text-sm text-muted-foreground max-h-60 overflow-y-auto">{result.reasoning}</p>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                <CandlestickChart size={48} />
                <p>Ожидание параметров для технического анализа.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
