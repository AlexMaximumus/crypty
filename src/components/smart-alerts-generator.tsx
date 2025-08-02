"use client";

import { useState } from 'react';
import { receiveSmartAlerts, type SmartAlertsOutput } from '@/ai/flows/receive-smart-alerts';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BellRing, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Mock data as the user is not expected to provide this
const mockInput = {
  marketAnalysis: "Рынок BTC показывает бычий тренд, ожидается прорыв уровня сопротивления в $75,000.",
  historicalData: "За последнюю неделю цена BTC выросла на 8%. Объемы торгов увеличились на 15%.",
  technicalIndicators: "RSI = 68, MACD показывает бычье пересечение.",
  userData: JSON.stringify({ riskTolerance: 'high', preferred_cryptos: ['BTC', 'ETH'] })
};


export function SmartAlertsGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartAlertsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await receiveSmartAlerts(mockInput);
      setResult(response);
    } catch (e) {
      setError("Не удалось сгенерировать оповещение. Попробуйте позже.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Генератор Оповещений</CardTitle>
        <CardDescription>Нажмите кнопку, чтобы симулировать получение умного оповещения от ИИ.</CardDescription>
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
      <CardFooter>
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Генерация..." : "Сгенерировать оповещение"}
        </Button>
      </CardFooter>
    </Card>
  );
}
