'use client'

import {Button, ConfigProvider} from "antd";
import {SessionProvider} from "next-auth/react";

export default function InnerLayout({children, session}: any) {
    console.log(session);
    return (
        <SessionProvider session={session}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#00b96b',
                    },
                }}
            >
                <Button type={'primary'}>Chan vc;</Button>
                {children}
            </ConfigProvider>
        </SessionProvider>
    )
}