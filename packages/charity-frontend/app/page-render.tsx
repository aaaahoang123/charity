'use client';

import Campaign, {CampaignStatus} from "@/app/core/model/campaign";
import {RestMeta} from "@/app/core/model/rest";
import {Avatar, Button, Card, Col, Progress, Row, Space, Statistic, Tag} from "antd";
import Image from "next/image";
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";
import styles from './page-render.module.scss';
import {useMemo} from "react";
import ClientNeedAuth from "@/app/common/component/need-auth/client-need-auth";
import {Role} from "@/app/core/role";
import DeleteCampaignBtn from "@/app/delete-campaign-btn";

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
        <Card bodyStyle={{padding: 0, flex: 1, display: 'flex', flexDirection: 'column'}} className={'flex flex-1'}>
            <Link href={`/campaigns/${campaign.slug}`} className={'flex-1 flex'}>
                <div className={'flex-1'}>
                    <div className={'aspect-[1.5/1] relative'}>
                        <Image src={campaign.imageUrls?.[0] ?? ''} alt={campaign.title} fill={true} style={{
                            objectFit: 'cover'
                        }}/>
                    </div>
                </div>
            </Link>
            <Link href={`/campaigns/${campaign.slug}`} className={'flex-1 flex'}>
                <div
                    className={'flex-1 px-4 pb-3 pt-4 font-bold text-xl text-gray-600 hover:text-green-700 aspect-auto'}>
                    {campaign.title}
                </div>
            </Link>
            <div className={'px-4 flex-1'}>
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
                    <Col flex={1} className={'text-right align-middle flex-col flex '}>
                        <ClientNeedAuth roles={[Role.ROLE_ANONYMOUS, Role.ROLE_USER]}>
                            <Button size={'small'}>Quyên góp</Button>
                        </ClientNeedAuth>
                        <ClientNeedAuth roles={[Role.ROLE_ADMIN]}>
                            {
                                campaign.status === CampaignStatus.INITIAL
                                    ? <DeleteCampaignBtn campaign={campaign}/>
                                    : null
                            }
                            {
                                campaign.totalDonations === 0
                                    ?
                                    <Button type={'default'} size={'small'}><Link
                                        href={`/campaigns/${campaign.slug}/edit`}>Sửa</Link></Button>
                                    : null
                            }
                        </ClientNeedAuth>
                    </Col>

                </Row>
            </div>

        </Card>
    )
};

const HomeRender = ({campaigns, pagination}: HomeRenderProps) => {
    return (
        <Card title={<div className={'text-center'}>Những hoàn cảnh khó khăn</div>}>
            <div className={'grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 auto-rows-fr'}>
                {campaigns.map(c => <CampaignItem campaign={c} key={c.id}/>)}
            </div>
        </Card>
    )
};

export default HomeRender;