import { SmartAlertsGenerator } from '@/components/smart-alerts-generator';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SmartAlertsPage() {
  return (
    <div className="flex flex-col gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Умные Оповещения</CardTitle>
                <CardDescription>
                Сгенерируйте оповещение на основе смоделированных рыночных данных, чтобы увидеть, как ИИ находит прибыльные возможности.
                </CardDescription>
            </CardHeader>
        </Card>
        <SmartAlertsGenerator />
    </div>
  );
}
