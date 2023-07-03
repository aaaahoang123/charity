import './globals.scss'
import {Inter} from 'next/font/google'
import InnerLayout from "@/app/layout/inner-layout";
import Logger from "js-logger";

const inter = Inter({subsets: ['latin']})

const handler = Logger.createDefaultHandler();
Logger.setHandler(handler);
const logLevel = process.env.LOG_LEVEL ?? 'DEBUG';
Logger.setLevel((Logger as any)[logLevel]);

export const metadata = {
  title: "Let's Charity",
  description: 'Make lives better',
}

export default async function RootLayout({children, params}: any) {
  return (
      <html lang="en" className={'text-gray-600'}>
      <body className={inter.className}>
      <InnerLayout params={params}>{children}</InnerLayout>
      </body>
      </html>
  )
}
