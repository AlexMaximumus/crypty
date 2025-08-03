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
import { Loader2, Lightbulb, TrendingUp, TrendingDown, MinusCircle, CandlestickChart as CandlestickChartIcon, BrainCircuit, LineChart, BarChart3, Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { ComposedChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Line, ReferenceLine, Label, Bar } from 'recharts';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  cryptocurrency: z.string().min(1, "Выберите криптовалюту"),
  interval: z.string().min(1, "Выберите интервал"),
});

type CandlestickProps = {
    fill?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    low?: number;
    high?: number;
    open?: number;
    close?: number;
};
  
const Candlestick = (props: CandlestickProps) => {
    const { x, y, width, height, low, high, open, close } = props;
    
    if (x === undefined || y === undefined || width === undefined || height === undefined || open === undefined || close === undefined || low === undefined || high === undefined) {
        return null;
    }

    const isBullish = close >= open;
    const color = isBullish ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))';
    const wickColor = isBullish ? 'hsl(var(--chart-2) / 0.7)' : 'hsl(var(--chart-1) / 0.7)';
    
    // Y-coordinate for the body depends on whether it's bullish or bearish
    const yBody = isBullish ? y + (open - close) : y;
    const heightBody = Math.max(1, Math.abs(open-close));

    return (
      <g strokeWidth={1}>
        {/* Wick */}
        <line x1={x + width / 2} y1={y + (open - high)} x2={x + width / 2} y2={y + (open - low)} stroke={wickColor} />
        {/* Body */}
        <rect x={x} y={yBody} width={width} height={heightBody} fill={color} />
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
      const chartData = response.candlestickData.map((d, index) => ({
          ...d,
          ohlc: [d.open, d.high, d.low, d.close],
          movingAverage: response.movingAverage?.find(m => m.timestamp === d.timestamp)?.value
      }));
      setResult({ ...response, candlestickData: chartData });
    } catch (e) {
      setError("Не удалось провести технический анализ. Попробуйте позже.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  
  const recommendationIsBuy = result?.recommendation === 'Buy';
  const recommendationIsSell = result?.recommendation === 'Sell';
  
  const analysisCards = result?.analysisBreakdown ? [
      {
          title: "Анализ свечей",
          content: result.analysisBreakdown.candlestickPatterns,
          icon: CandlestickChartIcon
      },
      {
          title: "Анализ тренда",
          content: result.analysisBreakdown.trendAnalysis,
          icon: LineChart
      },
       {
          title: "Анализ индикаторов",
          content: result.analysisBreakdown.indicatorAnalysis,
          icon: BrainCircuit
      },
      {
          title: "Уровни и цели",
          content: result.analysisBreakdown.supportResistance,
          icon: Target
      },
      {
          title: "Анализ объемов",
          content: result.analysisBreakdown.volumeAnalysis,
          icon: BarChart3
      }
  ] : [];

  return (
    <div className="grid gap-6">
       <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Параметры для ИИ-Аналитика</CardTitle>
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
                    <FormLabel>Временной интервал</FormLabel>
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
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto text-lg py-6">
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Анализирую..." : "Получить вердикт ИИ"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground min-h-[500px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">ИИ-аналитик изучает график и индикаторы...</p>
            <p>Это может занять несколько секунд.</p>
        </div>
      )}
      
      {error && <p className="text-destructive text-center">{error}</p>}
      
      {result && (
        <div className="w-full grid gap-8">
            <Card className={cn("border-2", 
                recommendationIsBuy && "border-green-500/50 bg-green-500/5",
                recommendationIsSell && "border-red-500/50 bg-red-500/5",
                !recommendationIsBuy && !recommendationIsSell && "border-yellow-500/50 bg-yellow-500/5"
            )}>
                <CardHeader>
                     <div className={cn('flex items-center gap-4', 
                        recommendationIsBuy && 'text-green-400',
                        recommendationIsSell && 'text-red-400',
                        !recommendationIsBuy && !recommendationIsSell && 'text-yellow-400'
                     )}>
                        {recommendationIsBuy && <TrendingUp className="h-10 w-10"/>}
                        {recommendationIsSell && <TrendingDown className="h-10 w-10"/>}
                        {!recommendationIsBuy && !recommendationIsSell && <MinusCircle className="h-10 w-10"/>}
                        <div>
                            <CardTitle className="text-4xl font-bold">Вердикт: {result.recommendation}</CardTitle>
                            <CardDescription className="text-lg">{result.summary}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="space-y-2">
                        <h3 className="font-semibold text-muted-foreground">Уверенность ИИ в прогнозе: {Math.round(result.confidenceScore * 100)}%</h3>
                        <Progress value={result.confidenceScore * 100} className="h-3" />
                    </div>
                </CardContent>
            </Card>

            <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={result.candlestickData} margin={{ top: 20, right: 80, bottom: 60, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                         <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(time) => new Date(time).toLocaleDateString()}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                            yAxisId="left" 
                            orientation="left" 
                            domain={['dataMin - (dataMax - dataMin) * 0.1', 'dataMax + (dataMax - dataMin) * 0.1']} 
                            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            width={80}
                        />
                        <YAxis yAxisId="right" orientation="right" domain={['dataMin', 'dataMax * 5']} hide />
                        <Tooltip content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg text-sm">
                                        <p className="text-muted-foreground">{new Date(data.timestamp).toLocaleString()}</p>
                                        <p>Open: <span className="font-bold text-foreground">${data.open.toFixed(2)}</span></p>
                                        <p>High: <span className="font-bold text-green-400">${data.high.toFixed(2)}</span></p>
                                        <p>Low: <span className="font-bold text-red-400">${data.low.toFixed(2)}</span></p>
                                        <p>Close: <span className="font-bold text-foreground">${data.close.toFixed(2)}</span></p>
                                        <p>Volume: <span className="font-bold text-foreground">{Number(data.volume).toFixed(2)}</span></p>
                                    </div>
                                );
                            }
                            return null;
                        }}/>
                         <Bar dataKey="volume" yAxisId="right" fill="hsl(var(--muted-foreground) / 0.3)" barSize={10} />
                        <Line
                            yAxisId="left"
                            type="linear"
                            dataKey="ohlc"
                            strokeWidth={0}
                            isAnimationActive={false}
                            dot={false}
                            activeDot={false}
                            // @ts-ignore
                            shape={(props) => <Candlestick {...props} />}
                        />
                         {result.movingAverage && (
                            <Line yAxisId="left" type="monotone" dataKey="movingAverage" stroke="hsl(var(--primary) / 0.8)" strokeWidth={2} dot={false} name="SMA 20" />
                        )}
                        {result.supportLevel && (
                            <ReferenceLine y={result.supportLevel} yAxisId="left" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="3 3">
                                <Label value={`Зона ПОКУПКИ (Поддержка): $${result.supportLevel.toFixed(2)}`} position="insideTopRight" fill="hsl(var(--chart-2))" fontSize={14} className="font-bold" />
                            </ReferenceLine>
                        )}
                        {result.resistanceLevel && (
                            <ReferenceLine y={result.resistanceLevel} yAxisId="left" stroke="hsl(var(--chart-1))" strokeWidth={2} strokeDasharray="3 3">
                                <Label value={`Зона ПРОДАЖИ (Сопротивление): $${result.resistanceLevel.toFixed(2)}`} position="insideTopRight" fill="hsl(var(--chart-1))" fontSize={14} className="font-bold" />
                            </ReferenceLine>
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-bold font-headline text-center">Подробный разбор от ИИ-Аналитика</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisCards.map((card, index) => (
                        <Card key={index} className="bg-card/50">
                            <CardHeader className="flex-row items-center gap-3 space-y-0">
                                <card.icon className="w-6 h-6 text-primary" />
                                <CardTitle className="text-lg font-headline">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{card.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </div>
      )}
       {!result && !isLoading && (
            <div className="text-center text-muted-foreground flex flex-col items-center gap-3 min-h-[500px] justify-center">
                <CandlestickChartIcon size={48} />
                <p className="text-lg">ИИ-аналитик готов к работе.</p>
                <p>Выберите криптовалюту, интервал и нажмите кнопку, чтобы получить вердикт.</p>
            </div>
        )}
    </div>
  );
}
