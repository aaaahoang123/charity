'use client'

import {ConfigProvider, Layout, theme} from "antd";
import {SessionProvider, signIn, useSession} from "next-auth/react";
import MainMenu from "@/app/layout/menu";
import {PropsWithChildren, useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import validateMessages from './validateMessage.json';
import {ClientServiceProvider} from "@/app/core/http/components";

const { Header, Content, Footer } = Layout;

const InnerLayoutRenderer = ({children}: PropsWithChildren) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const {
        token: { controlHeightLG },
    } = theme.useToken();

    // const {data: session} = useSession();

    // useEffect(() => {
    //     if ((session as any)?.error === 'RefreshAccessTokenError') {
    //         signIn('keycloak');
    //     }
    // }, [session]);

    return (
        <Layout style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
            <Header className={'blur-shadow flex items-center p-0'}>
                <div className={'container mx-auto flex'}>
                    <Link href={'/'} className={'logo'} style={{width: 128, height: 45}}>
                        <Image src={'/logo.png'} alt={'Logo'} width={128} height={45} priority={true} />
                    </Link>
                    <MainMenu />
                </div>
            </Header>
            <Content className={'p-0'}>
                <div style={{ marginTop: controlHeightLG * 1.25 }} className={'container mx-auto'}>
                    {children}
                </div>
            </Content>
        </Layout>
    )
}

export default function InnerLayout({children}: any) {
    return (
        <SessionProvider refetchInterval={90} refetchOnWindowFocus={true}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#00b96b',
                        colorBgLayout: '#f5f6f7'
                    },
                    components: {
                        Layout: {
                            colorBgHeader: '#ffffff',
                        },
                    }
                }}
                form={{
                    validateMessages,
                    requiredMark: true,
                }}
            >
                <ClientServiceProvider>
                    <InnerLayoutRenderer>
                        {children}
                    </InnerLayoutRenderer>
                </ClientServiceProvider>
            </ConfigProvider>
        </SessionProvider>
    )
}