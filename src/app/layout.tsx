
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'NeuroShield - AI Malware Intelligence',
  description: 'Your AI-Driven Malware Intelligence Partner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="hydrated">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent flash during initial load */
            body { 
              background: hsl(276 100% 4%);
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-mono bg-background text-foreground`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider defaultOpen>
              {children}
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
