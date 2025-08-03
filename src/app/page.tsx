import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Bell, MessageCircle, BookOpen, FlaskConical, CandlestickChart } from 'lucide-react';
import { DailyTradeIdea } from '@/components/daily-trade-idea';
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

      <DailyTradeIdea />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className={cn(
            "flex flex-col transition-all hover:shadow-lg relative overflow-hidden",
            feature.highlight ? "border-primary/50 bg-card" : "hover:border-primary/50"
          )}>
            {feature.highlight && (
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: 'radial-gradient(circle at 50% 0, hsl(var(--primary) / 0.5), transparent 70%)'
                    }}
                />
            )}
             <div className="relative z-10 flex flex-col flex-grow">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className={cn("rounded-lg p-3", feature.highlight ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary")}>
                        <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <Link href={feature.href} className="w-full">
                    <Button variant="outline" className="w-full bg-background/50 backdrop-blur-sm">
                      Перейти <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
