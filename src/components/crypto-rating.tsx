
'use client';

import { useState, useEffect } from 'react';
import { getCryptoRating, type CryptoRatingOutput } from '@/ai/flows/get-crypto-rating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

const ratingStyles = {
    'Very Bullish': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Bullish': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Neutral': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Bearish': 'bg-red-500/10 text-red-500 border-red-500/20',
    'Very Bearish': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function CryptoRating() {
    const [data, setData] = useState<CryptoRatingOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getCryptoRating({ cryptocurrencies: ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'] });
            setData(response);
        } catch (e) {
            console.error(e);
            setError('Не удалось загрузить рейтинг. Возможная причина - отсутствующие API-ключи в настройках проекта на Vercel.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur-lg opacity-20 group-hover:opacity-50 transition duration-200"></div>
            <Card className="relative">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline text-2xl">Рейтинг Криптовалют от ИИ</CardTitle>
                    </div>
                    <CardDescription>
                        Сравнительный анализ ключевых криптовалют на основе последних рыночных данных для помощи в выборе актива.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1">
                                             <Skeleton className="h-4 w-24" />
                                             <Skeleton className="h-3 w-48" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-20 rounded-md" />
                                    <Skeleton className="h-6 w-24 rounded-md" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-destructive p-4 flex flex-col items-center gap-4">
                            <AlertTriangle className="h-8 w-8" />
                            <p className="font-semibold">Произошла ошибка</p>
                            <p className="text-sm max-w-md">{error}</p>
                            <Button onClick={fetchData}>Попробовать снова</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Актив</TableHead>
                                    <TableHead>Цена</TableHead>
                                    <TableHead>Изм. (24ч)</TableHead>
                                    <TableHead className="text-right">Рейтинг ИИ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.ratings?.sort((a,b) => b.volume24h - a.volume24h).map((item) => (
                                    <TableRow key={item.symbol}>
                                        <TableCell>
                                            <div className="font-bold text-lg">{item.symbol}</div>
                                            <p className="text-xs text-muted-foreground max-w-xs">{item.summary}</p>
                                        </TableCell>
                                        <TableCell className="font-mono text-base">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell className={cn('font-mono text-base', item.change24h >= 0 ? 'text-green-400' : 'text-red-400')}>
                                            <div className="flex items-center gap-1">
                                                {item.change24h >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                                {item.change24h.toFixed(2)}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge className={cn("text-sm", ratingStyles[item.rating])}>
                                                {item.rating}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
