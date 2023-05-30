'use client'

import {ConfigProvider, Layout, theme} from "antd";
import {SessionProvider} from "next-auth/react";
import MainMenu from "@/app/layout/Menu";
import {useEffect, useState} from "react";

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
            >
                <Layout style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
                    <Header className={'blur-shadow'}>
                        <div className={'logo'} />
                        <MainMenu />
                    </Header>
                    <Content style={{ padding: ('0 ' + controlHeightLG * 1.25 + 'px') }}>
                        {children}
                    </Content>
                </Layout>
            </ConfigProvider>
        </SessionProvider>
    )
}