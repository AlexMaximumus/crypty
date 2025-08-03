"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { getCryptoAdvice } from '@/ai/flows/get-crypto-advice';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendHorizonal, Bot, User, BrainCircuit, Lightbulb } from "lucide-react";
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const exampleQueries = [
    "Какая торговая идея на сегодня по BTC?",
    "Сделай технический анализ для ETH на 4-часовом графике.",
    "Какой рейтинг у Solana сейчас?",
    "Какой кошелек лучше всего подходит для долгосрочного хранения Bitcoin?",
]

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  const processQuery = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getCryptoAdvice({ query });
      const assistantMessage: Message = { role: 'assistant', content: result.advice };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching crypto advice:", error);
      const errorMessage: Message = { role: 'assistant', content: "Извините, произошла ошибка. Попробуйте еще раз." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    processQuery(input);
  };
  
  const handleExampleQueryClick = (query: string) => {
    processQuery(query);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-lg">
                        <BrainCircuit className="h-7 w-7 text-primary"/>
                        <p className="font-headline">ИИ-Ассистент готов к работе</p>
                    </div>
                    <p>Задайте вопрос или выберите один из примеров ниже.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full max-w-2xl">
                        {exampleQueries.map((query, i) => (
                            <button key={i} onClick={() => handleExampleQueryClick(query)} className="text-left p-3 border rounded-lg hover:bg-muted transition-colors text-sm">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-yellow-400"/>
                                    <span>{query}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? "justify-end" : "justify-start")}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-secondary">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-[85%] rounded-lg p-3 text-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border')}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="max-w-[75%] rounded-lg p-3 text-sm bg-card border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: '0s' }}></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: '0.2s' }}></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: '0.4s' }}></span>
                    <span className="ml-2">ИИ-аналитик думает...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-card">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите о чем угодно..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
