"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { receiveSmartAlerts, type SmartAlertsOutput } from '@/ai/flows/receive-smart-alerts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BellRing, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
    cryptocurrency: z.string().min(1, "Выберите криптовалюту"),
    riskTolerance: z.enum(['low', 'medium', 'high']).default('medium'),
});

export function SmartAlertsGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartAlertsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: 'BTC',
      riskTolerance: 'medium',
    },
  });

  const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await receiveSmartAlerts({
          cryptocurrency: values.cryptocurrency,
          userData: JSON.stringify({ riskTolerance: values.riskTolerance })
      });
      setResult(response);
    } catch (e) {
      setError("Не удалось сгенерировать оповещение. Попробуйте позже.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGenerate)}>
                    <CardHeader>
                        <CardTitle className="font-headline">Генератор Оповещений</CardTitle>
                        <CardDescription>Выберите криптовалюту и ваш уровень риска. ИИ проанализирует реальные рыночные данные и сгенерирует оповещение.</CardDescription>
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
                            name="riskTolerance"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Ваша толерантность к риску</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="low" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Низкая</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="medium" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Средняя</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="high" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Высокая</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Генерация..." : "Сгенерировать оповещение"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Результат</CardTitle>
                <CardDescription>Здесь появится сгенерированное оповещение.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center min-h-[200px]">
                {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>ИИ анализирует рынок...</p>
                </div>
                ) : error ? (
                <Alert variant="destructive">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                ) : result ? (
                <Alert className="border-primary bg-primary/5">
                    <BellRing className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-primary font-bold flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Умное Оповещение!
                    </AlertTitle>
                    <AlertDescription className="text-foreground mt-2 space-y-3">
                    <p>{result.alertMessage}</p>
                    <div>
                        <p className="font-medium text-sm mb-1">Уровень уверенности: {Math.round(result.confidenceLevel * 100)}%</p>
                        <Progress value={result.confidenceLevel * 100} className="h-2" />
                    </div>
                    </AlertDescription>
                </Alert>
                ) : (
                <p className="text-muted-foreground">Готов к генерации оповещения.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
