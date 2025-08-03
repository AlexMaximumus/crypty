'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDailyTradeIdea, type DailyTradeIdeaOutput } from '@/ai/flows/get-daily-trade-idea';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, Lightbulb, Calculator, RefreshCw } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const calculatorSchema = z.object({
  investment: z.coerce.number().positive('Сумма должна быть положительной'),
});

export function DailyTradeIdea() {
  const [isLoading, setIsLoading] = useState(true);
  const [idea, setIdea] = useState<DailyTradeIdeaOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profit, setProfit] = useState<number | null>(null);

  const form = useForm<z.infer<typeof calculatorSchema>>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { investment: 1000 },
  });

  const fetchIdea = async () => {
    setIsLoading(true);
    setError(null);
    setIdea(null);
    setProfit(null);
    form.reset({ investment: 1000 });
    try {
      const response = await getDailyTradeIdea({});
      setIdea(response);
    } catch (e) {
      setError('Не удалось получить торговую идею. Попробуйте обновить.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
  }, []);
  
  const recommendationIsBuy = idea?.recommendation === 'buy';

  const chartData = idea
    ? [
        { label: 'Вход', price: idea.entryPrice },
        { label: 'Цель', price: idea.targetPrice },
      ]
    : [];

  const chartConfig = {
    price: {
      label: 'Цена',
      color: recommendationIsBuy ? 'hsl(var(--primary))' : 'hsl(var(--destructive))',
    },
  } satisfies ChartConfig;

  function onCalculate(values: z.infer<typeof calculatorSchema>) {
    if (!idea) return;
    const { investment } = values;
    const { entryPrice, targetPrice, recommendation } = idea;
    const quantity = investment / entryPrice;
    let calculatedProfit;
    if (recommendation === 'buy') {
      calculatedProfit = (targetPrice - entryPrice) * quantity;
    } else { // 'sell'
      calculatedProfit = (entryPrice - targetPrice) * quantity;
    }
    setProfit(calculatedProfit);
  }

  const profitPercentage = profit && idea ? (profit / (form.getValues('investment') || 1)) * 100 : 0;


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Идея Дня</CardTitle>
          <CardDescription>Актуальная торговая рекомендация от ИИ.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchIdea} disabled={isLoading}>
          <RefreshCw className={cn('h-5 w-5', isLoading && 'animate-spin')} />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-80 col-span-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-destructive col-span-full">{error}</div>
        ) : idea && (
          <>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <Badge variant="outline" className="text-lg py-1 px-3">{idea.cryptocurrency}</Badge>
                    <div className={`flex items-center gap-2 text-lg font-bold ${recommendationIsBuy ? 'text-green-400' : 'text-red-400'}`}>
                        {recommendationIsBuy ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                        <span>{recommendationIsBuy ? 'Покупка' : 'Продажа'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Цена входа</p>
                        <p className="text-2xl font-bold">${idea.entryPrice.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Целевая цена</p>
                        <p className="text-2xl font-bold">${idea.targetPrice.toLocaleString()}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> Обоснование</h3>
                    <p className="text-sm text-muted-foreground">{idea.reasoning}</p>
                </div>
                
                 <div className="h-60 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={recommendationIsBuy ? "hsl(var(--primary))" : "hsl(var(--destructive))"} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={recommendationIsBuy ? "hsl(var(--primary))" : "hsl(var(--destructive))"} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} />
                            <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                            <Tooltip content={<ChartTooltipContent hideIndicator />} />
                            <Area type="monotone" dataKey="price" stroke={chartConfig.price.color} fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
            
            <div className="space-y-6 rounded-lg border bg-secondary/30 p-6">
                <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-primary"/>
                    <h3 className="text-xl font-headline">Калькулятор Прибыли</h3>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-4">
                        <FormField
                            control={form.control}
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
                         <Button type="submit" className="w-full">Рассчитать</Button>
                    </form>
                </Form>

                {profit !== null && (
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Потенциальная прибыль:</span>
                            <span className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${profit.toFixed(2)}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Рентабельность (ROI):</span>
                             <span className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {profitPercentage.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
