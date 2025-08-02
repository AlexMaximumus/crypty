import { MarketAnalyzer } from '@/components/market-analyzer';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MarketAnalyzerPage() {
  return (
    <div className="flex flex-col gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Анализатор Рынка</CardTitle>
                <CardDescription>
                Используйте ИИ для анализа рыночных тенденций и получения рекомендаций по покупке или продаже.
                </CardDescription>
            </CardHeader>
        </Card>
        <MarketAnalyzer />
    </div>
  );
}
