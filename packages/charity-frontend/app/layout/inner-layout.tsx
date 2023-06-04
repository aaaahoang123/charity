'use client'

import {ConfigProvider, Layout, theme} from "antd";
import {SessionProvider} from "next-auth/react";
import MainMenu from "@/app/layout/Menu";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import validateMessages from './validateMessage.json';
import {ClientServiceProvider} from "@/app/core/http-service";

const { Header, Content, Footer } = Layout;

export default function InnerLayout({children, session}: any) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const {
        token: { colorBgContainer, controlHeightLG },
    } = theme.useToken();

    return (
        <SessionProvider session={session}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#00b96b',
                        colorBgLayout: '#ffffff'
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
                    <Layout style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
                        <Header className={'blur-shadow flex items-center'}>
                            <Link href={'/'} className={'logo'} style={{width: 128, height: 45}}>
                                <Image src={'/logo.png'} alt={'Logo'} width={128} height={45} />
                            </Link>
                            <MainMenu />
                        </Header>
                        <Content style={{ padding: ('0 ' + controlHeightLG * 1.25 + 'px') }}>
                            <div style={{ marginTop: controlHeightLG * 1.25 }}>
                                {children}
                            </div>
                        </Content>
                    </Layout>
                </ClientServiceProvider>
            </ConfigProvider>
        </SessionProvider>
    )
}