import { DailyTradeIdea } from '@/components/daily-trade-idea';
import { CryptoRating } from '@/components/crypto-rating';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bell, BookOpen, CandlestickChart, FlaskConical, MessageCircle } from 'lucide-react';

const features = [
  {
    title: "Анализатор Рынка",
    description: "ИИ-анализ для выявления лучших моментов для покупки и продажи.",
    icon: BarChart
  },
  {
    title: "Технический Анализ",
    description: "Автоматический анализ свечных графиков и индикаторов.",
    icon: CandlestickChart,
  },
  {
    title: "Умные Оповещения",
    description: "Получайте уведомления о потенциально прибыльных сделках.",
    icon: Bell
  },
  {
    title: "Автоматические Исследования",
    description: "Проводите глубокий анализ рынка по заданным метрикам.",
    icon: FlaskConical
  },
  {
    title: "ИИ-Ассистент",
    description: "Ваш личный помощник по всем вопросам криптовалют.",
    icon: MessageCircle
  },
  {
    title: "Руководства",
    description: "Пошаговые инструкции и база знаний по трейдингу.",
    icon: BookOpen
  },
];


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
       <Card className="w-full bg-gradient-to-br from-primary/10 via-card to-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Добро пожаловать в CryptoVision!</CardTitle>
            <CardDescription className="text-base">
              Ваш интеллектуальный навигатор в мире криптовалют. Используйте мощь ИИ для принятия верных решений.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Ключевые возможности:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                    <feature.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      <CryptoRating />
      
      <DailyTradeIdea />

    </div>
  );
}
