import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2, Book, GitBranch, Link2, LineChart, Smile } from "lucide-react";

const analyticsKnowledgeBase = [
    {
        value: "market-analysis",
        title: "Анализ Рынка",
        icon: BarChart2,
        content: "Общая оценка текущей ситуации на рынке. Включает в себя анализ цены, объема торгов, ликвидности и волатильности. Этот вид анализа помогает понять общее направление движения рынка и силу текущего тренда."
    },
    {
        value: "technical-analysis",
        title: "Технический Анализ",
        icon: LineChart,
        content: "Метод прогнозирования будущего движения цен на основе изучения прошлых рыночных данных, в первую очередь цены и объема. Технический анализ использует графики и индикаторы (например, скользящие средние, RSI), чтобы определить закономерности и сигналы для входа или выхода из сделки."
    },
    {
        value: "on-chain-analysis",
        title: "On-Chain Анализ",
        icon: Link2,
        content: "Анализ данных непосредственно из блокчейна криптовалюты. Включает в себя отслеживание крупных транзакций, притока/оттока средств с бирж, активности кошельков и других метрик. Этот анализ дает представление о действиях крупных игроков и общем состоянии сети."
    },
    {
        value: "sentiment-analysis",
        title: "Анализ Настроений (Sentiment Analysis)",
        icon: Smile,
        content: "Оценка общего эмоционального фона участников рынка по отношению к активу. Анализируются новости, социальные сети и другие публичные источники. Инструменты, такие как 'Индекс страха и жадности', являются частью этого анализа и помогают понять, преобладают ли на рынке бычьи (оптимистичные) или медвежьи (пессимистичные) настроения."
    },
    {
        value: "open-interest",
        title: "Термин: Открытый Интерес (Open Interest)",
        icon: GitBranch,
        content: "Общее количество активных фьючерсных или опционных контрактов, которые еще не были закрыты. Рост открытого интереса указывает на приток новых денег в актив и подтверждает силу текущего тренда. Снижение говорит о выходе из позиций и возможном ослаблении тренда."
    },
    {
        value: "funding-rate",
        title: "Термин: Ставка Финансирования (Funding Rate)",
        icon: GitBranch,
        content: "Механизм, используемый на биржах для привязки цены бессрочного фьючерса к спотовой цене актива. Положительная ставка означает, что трейдеры с длинными позициями (лонги) платят трейдерам с короткими (шорты), что указывает на бычьи настроения. Отрицательная ставка означает обратное."
    }
];

export default function TutorialsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Руководства</CardTitle>
          <CardDescription>Пошаговые инструкции по ключевым операциям с криптовалютой.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline">Как купить криптовалюту</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p><strong>Шаг 1: Выбор биржи.</strong> Зарегистрируйтесь на надежной криптовалютной бирже, такой как Binance, Coinbase или Kraken.</p>
                <p><strong>Шаг 2: Верификация аккаунта.</strong> Пройдите процедуру KYC (Know Your Customer), предоставив необходимые документы.</p>
                <p><strong>Шаг 3: Пополнение счета.</strong> Внесите фиатные деньги (например, рубли или доллары) на свой счет с помощью банковской карты или перевода.</p>
                <p><strong>Шаг 4: Покупка.</strong> Перейдите в раздел "Торговля" или "Рынки", выберите нужную криптовалюту (например, BTC) и совершите покупку.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline">Как продать криптовалюту</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p><strong>Шаг 1: Переход в раздел торговли.</strong> На вашей бирже найдите торговую пару с вашей криптовалютой (например, BTC/USD).</p>
                <p><strong>Шаг 2: Создание ордера на продажу.</strong> Укажите количество криптовалюты, которое хотите продать, и выберите тип ордера (рыночный или лимитный).</p>
                <p><strong>Шаг 3: Исполнение ордера.</strong> Подтвердите продажу. После исполнения ордера на вашем счете появятся фиатные деньги.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-headline">Как перевести криптовалюту</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p><strong>Шаг 1: Получение адреса кошелька.</strong> В кошельке, на который вы хотите отправить средства, скопируйте адрес для получения нужной криптовалюты.</p>
                <p><strong>Шаг 2: Инициирование вывода.</strong> В вашем текущем кошельке или на бирже выберите опцию "Вывести" или "Отправить".</p>
                <p><strong>Шаг 3: Ввод данных.</strong> Вставьте скопированный адрес получателя, укажите сумму и выберите сеть (убедитесь, что она совпадает с сетью кошелька получателя).</p>
                <p><strong>Шаг 4: Подтверждение транзакции.</strong> Проверьте все данные и подтвердите транзакцию. Обычно требуется подтверждение по почте или 2FA.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3 mb-2 text-primary">
                <Book className="h-6 w-6"/>
                <CardTitle className="font-headline text-primary">База Знаний по Аналитике</CardTitle>
            </div>
            <CardDescription>Здесь объясняются ключевые концепции и термины, которые ИИ использует для анализа и предоставления рекомендаций.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {analyticsKnowledgeBase.map(item => (
                    <AccordionItem key={item.value} value={item.value}>
                        <AccordionTrigger className="font-headline">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pl-8 text-muted-foreground">
                           {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
