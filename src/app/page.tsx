import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Bell, MessageCircle, BookOpen, FlaskConical, CandlestickChart } from 'lucide-react';
import { DailyTradeIdea } from '@/components/daily-trade-idea';
import { CryptoRating } from '@/components/crypto-rating';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "Анализатор Рынка",
    description: "ИИ-анализ для выявления лучших моментов для покупки и продажи.",
    href: "/market-analyzer",
    icon: BarChart
  },
  {
    title: "Технический Анализ",
    description: "Автоматический анализ свечных графиков и индикаторов.",
    href: "/technical-analysis",
    icon: CandlestickChart,
    highlight: true,
  },
  {
    title: "Умные Оповещения",
    description: "Получайте уведомления о потенциально прибыльных сделках.",
    href: "/smart-alerts",
    icon: Bell
  },
  {
    title: "Автоматические Исследования",
    description: "Проводите глубокий анализ рынка по заданным метрикам.",
    href: "/research",
    icon: FlaskConical
  },
  {
    title: "ИИ-Ассистент",
    description: "Ваш личный помощник по всем вопросам криптовалют.",
    href: "/assistant",
    icon: MessageCircle
  },
  {
    title: "Руководства",
    description: "Пошаговые инструкции для начинающих и опытных трейдеров.",
    href: "/tutorials",
    icon: BookOpen
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Добро пожаловать в CryptoVision</h1>
        <p className="text-muted-foreground">Ваш интеллектуальный навигатор в мире криптовалют. Используйте мощь ИИ для принятия верных решений.</p>
      </div>

      <CryptoRating />
      
      <DailyTradeIdea />

    </div>
  );
}
