"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzeMarketTrends, type AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  cryptocurrency: z.string().min(1, "Выберите криптовалюту"),
  analysisType: z.enum(['buy', 'sell'], { required_error: "Выберите тип анализа" }),
});

export function MarketAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeMarketTrendsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: 'BTC',
      analysisType: 'buy',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await analyzeMarketTrends(values);
      setResult(response);
    } catch (e) {
      setError("Не удалось получить анализ. Попробуйте позже.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Параметры Анализа</CardTitle>
              <CardDescription>Выберите криптовалюту и тип анализа. ИИ автоматически получит реальные рыночные данные и даст рекомендацию.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                name="analysisType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип анализа</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Покупка</SelectItem>
                        <SelectItem value="sell">Продажа</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Анализ..." : "Получить рекомендацию"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Результат Анализа</CardTitle>
          <CardDescription>Здесь появится рекомендация от ИИ.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Идет анализ данных...</p>
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : result ? (
            <div className="w-full space-y-4">
              <div className={`flex items-center gap-3 rounded-lg p-4 text-lg font-bold ${result.recommendation.toLowerCase().includes('покупать') || result.recommendation.toLowerCase().includes('buy') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {result.recommendation.toLowerCase().includes('покупать') || result.recommendation.toLowerCase().includes('buy') ? <TrendingUp className="h-6 w-6"/> : <TrendingDown className="h-6 w-6" />}
                <span>{result.recommendation}</span>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Уверенность: {Math.round(result.confidenceScore * 100)}%</h3>
                <Progress value={result.confidenceScore * 100} />
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> Обоснование</h3>
                <p className="text-sm text-muted-foreground">{result.reasoning}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Ожидание параметров для анализа.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
