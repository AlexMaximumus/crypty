import { AiAssistant } from '@/components/ai-assistant';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AssistantPage() {
  return (
    <div className="h-full flex flex-col">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="font-headline">ИИ-Ассистент</CardTitle>
          <CardDescription>
            Ваш персональный крипто-аналитик. Задайте вопрос или используйте примеры ниже.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex-1 min-h-0">
        <AiAssistant />
      </div>
    </div>
  );
}
