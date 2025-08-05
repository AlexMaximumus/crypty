import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Brush, Database, Cable, Type } from "lucide-react";

const techStack = [
    {
        category: "Ядро и Язык",
        icon: Type,
        items: [
            { name: "TypeScript", description: "Основной язык программирования. Добавляет строгую типизацию в JavaScript, повышая надежность и читаемость кода." },
            { name: "Next.js", description: "Ведущий фреймворк на базе React. Обеспечивает быструю загрузку, рендеринг на стороне сервера (SSR) и превосходную производительность." },
            { name: "React", description: "Библиотека для построения пользовательских интерфейсов. Позволяет создавать переиспользуемые компоненты." },
        ]
    },
    {
        category: "Интерфейс и Стилизация",
        icon: Brush,
        items: [
            { name: "ShadCN UI", description: "Набор готовых, стильных и легко настраиваемых UI-компонентов (кнопки, карточки, формы)." },
            { name: "Tailwind CSS", description: "Утилитарный CSS-фреймворк, который позволяет быстро стилизовать приложение, не выходя из HTML." },
            { name: "Lucide React", description: "Библиотека для иконок. Предоставляет большой набор четких и легковесных иконок." },
            { name: "Recharts", description: "Библиотека для создания интерактивных и красивых графиков и диаграмм." },
        ]
    },
    {
        category: "Искусственный Интеллект",
        icon: Cpu,
        items: [
            { name: "Genkit", description: "Фреймворк от Google для создания AI-агентов и потоков. Управляет взаимодействием с моделями и инструментами." },
            { name: "Gemini", description: "Семейство мощных мультимодальных моделей от Google, которое является 'мозгом' всех AI-функций в приложении." },
        ]
    },
    {
        category: "Данные и Интеграции",
        icon: Cable,
        items: [
            { name: "CCXT", description: "Библиотека для подключения к API криптовалютных бирж. Используется для получения исторических и рыночных данных." },
            { name: "WebSockets", description: "Технология для установления постоянного соединения с сервером биржи (Binance) для получения цен в реальном времени." },
        ]
    }
];

export default function TechStackPage() {
    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Технологический стек</CardTitle>
                    <CardDescription>
                        Полный список фреймворков, библиотек и сервисов, на которых построено приложение CryptoVision.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-8">
                {techStack.map((category) => (
                    <Card key={category.category}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-primary">
                                <category.icon className="h-6 w-6" />
                                {category.category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {category.items.map((item) => (
                                     <div key={item.name} className="flex flex-col md:flex-row gap-2 md:gap-4">
                                        <Badge variant="outline" className="h-fit py-1 md:w-48 flex-shrink-0 justify-center">{item.name}</Badge>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
