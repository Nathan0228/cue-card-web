import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto, Open_Sans, Noto_Sans, Lora, Merriweather } from "next/font/google";
import "./globals.css";
import Header from '@/app/ui/header'
import Footer from '@/app/ui/footer'
import { cookies } from 'next/headers'

export const runtime = 'edge'; //部署到Cloudflare Pages时，需要指定运行时环境
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["100","300","400","500","700","900"] })
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"] })
const notoSans = Noto_Sans({ variable: "--font-noto-sans", subsets: ["latin"] })
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] })
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cue Card Home",
  description: "Cue card building",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preferred = (cookies() as any)?.get?.('preferred_font')?.value ?? 'font-geist'

  return (

    <html lang="en" className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${notoSans.variable} ${lora.variable} ${merriweather.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${preferred} antialiased flex min-h-screen flex-col`}
      >
        <Header />

        <main className="flex-grow">
          {children}
        </main>
        {/* {children} */}
        <Footer />
      </body>
    </html>
  );
}
