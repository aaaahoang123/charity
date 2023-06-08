'use client';

import Campaign from "@/app/core/model/campaign";
import {RestMeta} from "@/app/core/model/rest";
import {Avatar, Button, Card, Col, Progress, Row, Space, Statistic, Tag} from "antd";
import Image from "next/image";
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import styles from './page-render.module.scss';
import {useMemo} from "react";

export interface HomeRenderProps {
    campaigns: Campaign[];
    pagination?: RestMeta;
}

const renderRemainDayTag = (daysRemain: number) => {
    if (daysRemain < 0) {
        return <Tag color="magenta" className={'me-0'}>Quá {-daysRemain} ngày</Tag>;
    }

    if (daysRemain === 0) {
        return <Tag color={'orange'} className={'me-0'}>Sắp hết hạn</Tag>;
    }

    return <Tag color={'cyan'} className={'me-0'}>Còn {daysRemain} ngày</Tag>;
};

export const CampaignItem = ({campaign}: { campaign: Campaign }) => {
    const percent = useMemo(() => Math.round(campaign.totalReceivedAmount / campaign.targetAmount), [campaign]);
    return (
        <Link href={`/campaigns/${campaign.slug}`}>
            <Card bodyStyle={{padding: 0}}>
                <div className={'aspect-[1.5/1] relative'}>
                    <Image src={campaign.imageUrls?.[0] ?? ''} alt={campaign.title} fill={true} style={{
                        objectFit: 'cover'
                    }}/>
                </div>
                <div className={'mt-3 px-4'}>
                    <div className={'mb-2'}>
                        <span className={'font-bold text-xl text-gray-600 hover:text-green-700'}>
                            {campaign.title}
                        </span>
                    </div>


                    <Row className={'mb-2'}>
                        <Col flex={5}>
                            <Space>
                                <Avatar src={campaign.organization?.avatarUrl} icon={<UserOutlined/>}/>
                                {campaign.organization?.name}
                            </Space>
                        </Col>

                        <Col flex={2} className={'text-right'}>
                            {renderRemainDayTag(campaign.daysRemain)}
                        </Col>
                    </Row>

                    <div className={'mb-1'}>
                        <div><strong
                            className={'text-lg'}>{campaign.totalReceivedAmountStr}</strong> / {campaign.targetAmountStr}
                        </div>
                        <Progress percent={percent} showInfo={false} size={'small'}/>
                    </div>

                    <Row className={'mb-2'}>
                        <Col flex={1}>
                            <Statistic className={styles.statistic} title="Lượt quyên góp"
                                       value={campaign.totalDonations}/>
                        </Col>
                        <Col flex={1}>
                            <Statistic className={styles.statistic} title="Đạt được" value={`${percent}%`}/>
                        </Col>
                        <Col flex={1} className={'text-right align-middle'}>
                            <Button size={'small'}>Quyên góp</Button>
                        </Col>
                    </Row>
                </div>

            </Card>
        </Link>
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