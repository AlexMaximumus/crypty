'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDailyTradeIdea, type DailyTradeIdeaOutput } from '@/ai/flows/get-daily-trade-idea';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, Lightbulb, Calculator, RefreshCw } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const calculatorSchema = z.object({
  investment: z.coerce.number().positive('Сумма должна быть положительной'),
});

interface ChartDataPoint {
    time: number;
    price: number;
}

export function DailyTradeIdea() {
  const [isLoading, setIsLoading] = useState(true);
  const [idea, setIdea] = useState<DailyTradeIdeaOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculatorForm = useForm<z.infer<typeof calculatorSchema>>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { investment: 1000 },
  });

  const setupPriceSimulation = (initialPrice: number) => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    
    setChartData([{ time: Date.now(), price: initialPrice }]);
    let lastPrice = initialPrice;

    intervalRef.current = setInterval(() => {
        const change = (Math.random() - 0.5) * (lastPrice * 0.0005);
        const newPrice = lastPrice + change;
        lastPrice = newPrice;
        
        setChartData(prevData => {
            const newData = [...prevData, { time: Date.now(), price: newPrice }];
            // Keep only last 100 data points for performance
            return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
        });
    }, 1000);
  };

  const fetchIdea = async (crypto: string) => {
    setIsLoading(true);
    setError(null);
    setIdea(null);
    setProfit(null);
    setChartData([]);
    calculatorForm.reset({ investment: 1000 });
    
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    try {
      const response = await getDailyTradeIdea({ cryptocurrency: crypto });
      setIdea(response);
      setupPriceSimulation(response.entryPrice);
    } catch (e) {
      setError('Не удалось получить торговую идею. Попробуйте обновить.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea(selectedCrypto);

    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [selectedCrypto]);
  
  const recommendationIsBuy = idea?.recommendation === 'buy';

  const chartConfig = {
    price: {
      label: 'Цена',
      color: recommendationIsBuy ? 'hsl(var(--primary))' : 'hsl(var(--destructive))',
    },
  } satisfies ChartConfig;

  function onCalculate(values: z.infer<typeof calculatorSchema>) {
    if (!idea || !chartData.length) return;
    const { investment } = values;
    const { entryPrice, targetPrice, recommendation } = idea;
    
    const lastPrice = chartData[chartData.length - 1].price;
    const quantity = investment / entryPrice;
    let calculatedProfit;

    if (recommendation === 'buy') {
      calculatedProfit = (lastPrice - entryPrice) * quantity;
    } else { // 'sell'
      calculatedProfit = (entryPrice - lastPrice) * quantity;
    }
    setProfit(calculatedProfit);
  }

  const profitPercentage = profit && idea ? (profit / (calculatorForm.getValues('investment') || 1)) * 100 : 0;
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : idea?.entryPrice;


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Идея Дня</CardTitle>
          <CardDescription>Актуальная торговая рекомендация от ИИ на основе рыночных данных.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto} disabled={isLoading}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Валюта" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="BTC">Bitcoin</SelectItem>
                    <SelectItem value="ETH">Ethereum</SelectItem>
                    <SelectItem value="SOL">Solana</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => fetchIdea(selectedCrypto)} disabled={isLoading}>
                <RefreshCw className={cn('h-5 w-5', isLoading && 'animate-spin')} />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-80 col-span-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-destructive col-span-full flex flex-col items-center justify-center h-80">
            <p>{error}</p>
            <Button onClick={() => fetchIdea(selectedCrypto)} className="mt-4">Попробовать снова</Button>
            </div>
        ) : idea && (
          <>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <Badge variant="outline" className="text-lg py-1 px-3">{idea.cryptocurrency}</Badge>
                    <div className={cn('flex items-center gap-2 text-lg font-bold', recommendationIsBuy ? 'text-green-400' : 'text-red-400')}>
                        {recommendationIsBuy ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                        <span>{recommendationIsBuy ? 'Покупка' : 'Продажа'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Цена входа</p>
                        <p className="text-xl font-bold">${idea.entryPrice.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Текущая цена</p>
                        <p className="text-xl font-bold">${currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2})}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Целевая цена</p>
                        <p className="text-xl font-bold">${idea.targetPrice.toLocaleString()}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> Обоснование</h3>
                    <p className="text-sm text-muted-foreground">{idea.reasoning}</p>
                </div>
                
                 <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ChartContainer config={chartConfig}>
                          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={chartConfig.price.color} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={chartConfig.price.color} stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                              <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} hide/>
                              <YAxis domain={['dataMin - (dataMax - dataMin) * 0.2', 'dataMax + (dataMax - dataMin) * 0.2']} hide />
                              <Tooltip 
                                content={<ChartTooltipContent hideIndicator formatter={(value) => (
                                  <div className="flex flex-col">
                                      <span>Цена: ${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
                                  </div>
                                )} />} 
                              />
                              <Area type="monotone" dataKey="price" stroke={chartConfig.price.color} fillOpacity={1} fill="url(#colorPrice)" dot={false} />
                          </AreaChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="space-y-6 rounded-lg border bg-secondary/30 p-6">
                <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-primary"/>
                    <h3 className="text-xl font-headline">Калькулятор Прибыли</h3>
                </div>

                <Form {...calculatorForm}>
                    <form onSubmit={calculatorForm.handleSubmit(onCalculate)} className="space-y-4">
                        <FormField
                            control={calculatorForm.control}
                            name="investment"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Сумма инвестиции ($)</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Например, 1000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <Button type="submit" className="w-full">Рассчитать по текущей цене</Button>
                    </form>
                </Form>

                {profit !== null && (
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Потенциальная прибыль:</span>
                            <span className={cn('text-lg font-bold', profit >= 0 ? 'text-green-400' : 'text-red-400')}>
                                ${profit.toFixed(2)}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Рентабельность (ROI):</span>
                             <span className={cn('text-lg font-bold', profit >= 0 ? 'text-green-400' : 'text-red-400')}>
                                {profitPercentage.toFixed(2)}%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2">Расчет основан на текущей цене ${currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2})} и цене входа.</p>
                    </div>
                )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
