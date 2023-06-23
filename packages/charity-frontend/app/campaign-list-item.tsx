'use client';

import Campaign, {CampaignStatus} from "@/app/core/model/campaign";
import {useMemo} from "react";
import {Avatar, Button, Card, CardProps, Col, Progress, Row, Space, Statistic, Tag} from "antd";
import Link from "next/link";
import Image from "next/image";
import {UserOutlined} from "@ant-design/icons";
import styles from "@/app/page-render.module.scss";
import ClientNeedAuth from "@/app/common/component/need-auth/client-need-auth";
import {Role} from "@/app/core/role";
import DeleteCampaignBtn from "@/app/delete-campaign-btn";

export interface CampaignItemProps {
    campaign: Campaign;
    displayActions?: boolean;
    title?: CardProps['title'];
}

const renderRemainDayTagRender = (daysRemain: number) => {
    if (daysRemain < 0) {
        return <Tag color="magenta" className={'me-0'}>Quá {-daysRemain} ngày</Tag>;
    }

    if (daysRemain === 0) {
        return <Tag color={'orange'} className={'me-0'}>Sắp hết hạn</Tag>;
    }

    return <Tag color={'cyan'} className={'me-0'}>Còn {daysRemain} ngày</Tag>;
};
const CampaignItem = ({ campaign, displayActions, title }: CampaignItemProps) => {
    const percent = useMemo(() => Math.round(campaign.totalReceivedAmount / campaign.targetAmount * 100), [campaign]);
    return (
        <Card bodyStyle={{padding: 0, flex: 1, display: 'flex', flexDirection: 'column'}}
              title={title}
              // headStyle={{ minHeight: 0, padding: '.25rem 1rem' }}
              className={'flex flex-1 flex-col'}>
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
                        {renderRemainDayTagRender(campaign.daysRemain)}
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
                    <Col flex={1} className={'text-right align-middle flex-col flex'}>
                        {
                            displayActions ? (
                                <>
                                    <ClientNeedAuth roles={[Role.ROLE_ANONYMOUS, Role.ROLE_USER]}>
                                        <Button size={'small'}>
                                            <Link href={`/campaigns/${campaign.slug}/donate`}>
                                                Quyên góp
                                            </Link>
                                        </Button>
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
                                </>
                            ) : null
                        }
                    </Col>

                </Row>
            </div>
        </Card>
    )
};

export default CampaignItem;