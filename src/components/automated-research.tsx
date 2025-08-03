"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { conductResearch, type ConductResearchOutput } from '@/ai/flows/conduct-research';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Beaker, FileText, BarChart2, Link2, GitBranch, Smile, LineChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formSchema = z.object({
  cryptocurrency: z.string().min(1, "Выберите криптовалюту"),
  marketData: z.string().min(10, "Введите рыночные данные"),
  onChainData: z.string().min(10, "Введите on-chain данные"),
  technicalIndicators: z.string().min(10, "Введите технические индикаторы"),
  sentimentMetrics: z.string().min(10, "Введите sentiment-метрики"),
});

const exampleData = {
    marketData: 'Цена: $68,000, Объем (24ч): $45B, Глубина стакана (+-2%): $300M, OI: $15B, Funding Rate: 0.01%',
    onChainData: 'Активные адреса: 900k, Новые адреса: 400k, Приток на биржи: 20k BTC, Отток: 25k BTC, MVRV-Z: 2.5',
    technicalIndicators: 'RSI(14): 65, MACD: бычий, Bollinger Bands: цена у верхней границы, EMA(50) пересекла EMA(200) вверх.',
    sentimentMetrics: 'Fear & Greed Index: 75 (Жадность), Twitter: умеренно-позитивный, Google Trends (BTC): рост на 15%',
};

export function AutomatedResearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConductResearchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: 'BTC',
      ...exampleData
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await conductResearch(values);
      setResult(response);
    } catch (e) {
      setError("Не удалось провести исследование. Попробуйте позже.");
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
              <CardTitle className="font-headline">Параметры Исследования</CardTitle>
              <CardDescription>Заполните поля данными для анализа (используются примеры).</CardDescription>
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
              <FormField control={form.control} name="marketData" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Рыночные данные</FormLabel>
                    <Textarea {...field} rows={3} />
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="onChainData" render={({ field }) => (
                  <FormItem>
                    <FormLabel>On-chain данные</FormLabel>
                    <Textarea {...field} rows={3} />
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="technicalIndicators" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Технические индикаторы</FormLabel>
                    <Textarea {...field} rows={3} />
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="sentimentMetrics" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sentiment-метрики</FormLabel>
                    <Textarea {...field} rows={3} />
                    <FormMessage />
                  </FormItem>
              )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Исследование..." : "Провести исследование"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Результат Исследования</CardTitle>
          <CardDescription>Здесь появится подробный отчет от ИИ.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>ИИ проводит комплексный анализ...</p>
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : result ? (
            <div className="w-full space-y-4">
                 <div className="flex items-center gap-3 rounded-lg p-4 text-lg font-bold bg-primary/10 text-primary">
                    <Beaker className="h-6 w-6"/>
                    <span>Рекомендация: {result.recommendation}</span>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Уверенность: {Math.round(result.confidenceScore * 100)}%</h3>
                    <Progress value={result.confidenceScore * 100} />
                </div>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger><div className="flex items-center gap-2"><FileText />Краткая сводка</div></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{result.summary}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger><div className="flex items-center gap-2"><BarChart2 />Анализ рынка</div></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{result.marketAnalysis}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger><div className="flex items-center gap-2"><Link2 />On-chain анализ</div></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{result.onChainAnalysis}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger><div className="flex items-center gap-2"><LineChart />Технический анализ</div></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{result.technicalAnalysis}</AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-5">
                        <AccordionTrigger><div className="flex items-center gap-2"><Smile />Sentiment анализ</div></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{result.sentimentAnalysis}</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
                <Beaker size={48} className="mx-auto mb-2" />
                <p>Ожидание параметров для исследования.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
