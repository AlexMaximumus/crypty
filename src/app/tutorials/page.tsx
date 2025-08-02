import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
    </div>
  );
}
