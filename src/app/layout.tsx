import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart, Bell, BookOpen, LayoutDashboard, MessageCircle, PanelLeft, FlaskConical } from 'lucide-react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Logo from '@/components/icons/logo';

export const metadata: Metadata = {
  title: 'CryptoVision',
  description: 'Приложение для анализа криптовалют на базе ИИ',
};

const navItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/market-analyzer', label: 'Анализатор', icon: BarChart },
  { href: '/smart-alerts', label: 'Оповещения', icon: Bell },
  { href: '/research', label: 'Исследования', icon: FlaskConical },
  { href: '/assistant', label: 'Ассистент', icon: MessageCircle },
  { href: '/tutorials', label: 'Руководства', icon: BookOpen },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen w-full bg-background text-foreground font-body antialiased')}>
        <div className="flex min-h-screen w-full">
          <aside className="hidden w-16 flex-col border-r bg-card sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Link href="/" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">CryptoVision</span>
              </Link>
              <TooltipProvider>
                {navItems.map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link href={item.href} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </aside>
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs bg-card">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                      <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                      <span className="sr-only">CryptoVision</span>
                    </Link>
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </header>
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
