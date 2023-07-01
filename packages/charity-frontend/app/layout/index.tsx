import '../globals.scss'
import {Inter} from 'next/font/google'
import InnerLayout from "@/app/layout/inner-layout";
import Logger from "js-logger";

const inter = Inter({subsets: ['latin']})

const handler = Logger.createDefaultHandler();
Logger.setHandler(handler);
Logger.setLevel((Logger as any)[process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'DEBUG']);

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
