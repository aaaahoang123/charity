import '../globals.scss'
import {Inter} from 'next/font/google'
import InnerLayout from "@/app/layout/inner-layout";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({children, params}: any) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <InnerLayout params={params}>{children}</InnerLayout>
        </body>
        </html>
    )
}
