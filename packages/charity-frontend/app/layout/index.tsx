import '../globals.scss'
import {Inter} from 'next/font/google'
import InnerLayout from "@/app/layout/inner-layout";

const inter = Inter({subsets: ['latin']})

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
