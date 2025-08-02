import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Bell, MessageCircle, BookOpen } from 'lucide-react';

const features = [
  {
    title: "Анализатор Рынка",
    description: "ИИ-анализ для выявления лучших моментов для покупки и продажи.",
    href: "/market-analyzer",
    icon: BarChart
  },
  {
    title: "Умные Оповещения",
    description: "Получайте уведомления о потенциально прибыльных сделках.",
    href: "/smart-alerts",
    icon: Bell
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
        <div className="mt-4">
          <Link href="/market-analyzer">
            <Button>
              Начать анализ <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col transition-all hover:border-primary/50 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={feature.href} className="w-full">
                <Button variant="outline" className="w-full">
                  Перейти <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
