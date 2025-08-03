import { TechnicalAnalysis } from '@/components/technical-analysis';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TechnicalAnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Технический Анализ</CardTitle>
          <CardDescription>
            Выберите криптовалюту и интервал. ИИ автоматически получит исторические данные, построит свечной график и предоставит торговую рекомендацию на основе технического анализа.
          </CardDescription>
        </CardHeader>
      </Card>
      <TechnicalAnalysis />
    </div>
  );
}
