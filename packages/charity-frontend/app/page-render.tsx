'use client';

import Campaign from "@/app/core/model/campaign";
import {RestMeta} from "@/app/core/model/rest";
import {Avatar, Card, Col, Progress, Row, Space, theme} from "antd";
import Image from "next/image";
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import styles from './page-render.module.scss';

export interface HomeRenderProps {
    campaigns: Campaign[];
    pagination?: RestMeta;
}

export const CampaignItem = ({campaign}: { campaign: Campaign }) => {
    const {token} = theme.useToken();
    return (
        <Card bodyStyle={{ padding: 0 }}>
            <div className={'aspect-[1.5/1] relative'}>
                <Image src={campaign.imageUrls?.[0] ?? ''} alt={campaign.title} fill={true} style={{
                    objectFit: 'cover'
                }}/>
            </div>
            <div className={'mt-3 px-2'}>
                <Link href={'/'}
                      className={'font-bold text-xl text-gray-600 hover:text-green-700'}
                >
                    {campaign.title}
                </Link>

                <div>
                    <Space>
                        <Avatar src={campaign.organization?.avatarUrl} icon={<UserOutlined />} />
                        {campaign.organization?.name}
                    </Space>

                </div>
                Còn {campaign.daysRemain} ngày

                <div>
                    100000000 / 20000000000
                    <Progress percent={20} showInfo={false} />
                </div>

                <div>
                    Lượt quyên góp: 200
                </div>
                <div>
                    Đạt được: 6%
                </div>


            </div>

        </Card>
    )
};

const HomeRender = ({campaigns, pagination}: HomeRenderProps) => {
    return (
        <Card title={<div className={'text-center'}>Những hoàn cảnh khó khăn</div>}>
            <Row gutter={8}>
                {campaigns.map(c => (
                    <Col xs={24}
                         xxl={4}
                         lg={6}
                         md={8}
                         sm={12}
                         key={c.id}
                         className={'mb-2'}
                    >
                        <CampaignItem campaign={c}/>
                    </Col>
                ))}
            </Row>
        </Card>
    )
};

export default HomeRender;