'use client'

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    DownOutlined,
    LoginOutlined,
    LogoutOutlined,
    PlusOutlined,
    SettingOutlined, TransactionOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {sessionMatchAnyRoles} from "@/app/api/auth/[...nextauth]/route";
import {Role} from "@/app/core/role";

type MenuClickEvent = Parameters<NonNullable<MenuProps['onClick']>>[0];

const items: MenuProps['items'] = [
    // {
    //     label: 'Navigation One',
    //     key: 'mail',
    //     icon: <MailOutlined />,
    // },
    // {
    //     label: 'Navigation Two',
    //     key: 'app',
    //     icon: <AppstoreOutlined />,
    //     disabled: true,
    // },
    // {
    //     label: 'Navigation Three - Submenu',
    //     key: 'SubMenu',
    //     icon: <SettingOutlined />,
    //     children: [
    //         {
    //             type: 'group',
    //             label: 'Item 1',
    //             children: [
    //                 {
    //                     label: 'Option 1',
    //                     key: 'setting:1',
    //                 },
    //                 {
    //                     label: 'Option 2',
    //                     key: 'setting:2',
    //                 },
    //             ],
    //         },
    //         {
    //             type: 'group',
    //             label: 'Item 2',
    //             children: [
    //                 {
    //                     label: 'Option 3',
    //                     key: 'setting:3',
    //                 },
    //                 {
    //                     label: 'Option 4',
    //                     key: 'setting:4',
    //                 },
    //             ],
    //         },
    //     ],
    // },
];

const useMenuItems = () => {
    const {data, status} = useSession();
    const user = data?.user;
    const access = (data as any)?.resource_access;
    const issuer = (data as any)?.issuer;
    return useMemo(() => {
        const result = [...items];
        if (status === 'loading') return result;

        if (status === 'authenticated' && !(data as any)?.error) {
            if (sessionMatchAnyRoles(data, [Role.ROLE_ADMIN])) {
                result.push(
                    {
                        label: <Link href={'/donations'}>Duyệt thanh toán</Link>,
                        key: '/donations',
                        icon: <TransactionOutlined/>,
                    },
                    {
                        label: (
                            <Link href={'/campaigns/create'}>Đợt quyên góp</Link>
                        ),
                        key: '/campaigns/create',
                        icon: <PlusOutlined/>
                    }
                )
            }

            if (sessionMatchAnyRoles(data, [Role.REALM_ADMIN])) {
                const baseUrl = issuer.replace('realms', 'admin');
                const realm = issuer.split('/').slice(-1);
                result.push({
                    label: (
                        <a href={`${baseUrl}/console/#/${realm}/users`} target={'_blank'}>
                            QL User
                        </a>
                    ),
                    key: 'user-management',
                    icon: <UserSwitchOutlined />,
                })
            }

            result.push({
                label: user?.name,
                key: 'username',
                icon: <DownOutlined />,
                style: {
                    paddingRight: 0
                },
                children: [
                    {
                        label: (
                            <a href={`${issuer}/account`} target={'_blank'}>
                                Quản lý tài khoản
                            </a>
                        ),
                        key: 'manage-account',
                        icon: <SettingOutlined/>,
                    },
                    {
                        label: 'Đăng xuất',
                        key: 'logout',
                        icon: <LogoutOutlined/>
                    }
                ]
            });
            return result;
        }

        result.push({
            label: 'Đăng nhập/Đăng ký',
            key: 'login',
            icon: <LoginOutlined/>,
            style: {
                paddingRight: 0
            }
        });
        return result;
    }, [status, data, user?.name, issuer]);
}

const MainMenu = () => {
    const asPath = usePathname();
    const [current, setCurrent] = useState(asPath);
    const menuItems = useMenuItems();
    useEffect(() => {
        setCurrent(asPath);
    }, [asPath, setCurrent]);
    const onClick: MenuProps['onClick'] = useCallback(async (e: MenuClickEvent) => {
        if (e.key === 'login') {
            await signIn('keycloak');
        }
        if (e.key === 'logout') {
            await signOut();
        }
    }, []);

    return <Menu onClick={onClick}
                 selectedKeys={[current]}
                 mode="horizontal"
                 items={menuItems}
                 className={'justify-end border-b-0 ml-auto w-full'}
    />;
};

export default MainMenu;