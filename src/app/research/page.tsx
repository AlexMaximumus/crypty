import { AutomatedResearch } from '@/components/automated-research';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResearchPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Автоматизированные Исследования</CardTitle>
          <CardDescription>
            Проведите комплексный анализ рынка с помощью ИИ. Заполните поля ниже, чтобы получить подробный отчет и рекомендации.
          </CardDescription>
        </CardHeader>
      </Card>
      <AutomatedResearch />
    </div>
  );
}
