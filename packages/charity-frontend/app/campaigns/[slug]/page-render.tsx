'use client';

import Campaign, {CampaignStatus} from "@/app/core/model/campaign";
import ReactMarkdown from "react-markdown";
import {Avatar, Button, Card, Carousel, Col, Divider, message, Progress, Row, Space, Statistic} from "antd";
import Image from "next/image";
import chunk from 'lodash/chunk';
import React, {useEffect, useMemo} from "react";
import styles from "@/app/page-render.module.scss";
import {FacebookOutlined, LinkedinOutlined, RedditOutlined, UserOutlined, WhatsAppOutlined} from "@ant-design/icons";
import {usePathname, useRouter} from "next/navigation";
import {useSearchParamsObject} from "@/app/common/util/use-search-params-object";
import Link from "next/link";
import {FacebookShareButton, LinkedinShareButton, RedditShareButton, WhatsappShareButton,} from 'next-share';
import TimeDisplay from "@/app/common/component/time-display";
import ClientNeedAuth from "@/app/common/component/need-auth/client-need-auth";
import {Role} from "@/app/core/role";
import SubscribeButton from "@/app/campaigns/[slug]/subscribe-button";

export interface ServerQueryParams {
    success?: string;
    error?: string;
    [key: string]: undefined | null | string;
}

export interface CampaignDetailRenderProps {
    campaign: Campaign;
}

const renderIndexing = [0, 1, 2];
const renderCarousel = (chunkedImages: string[][]) => {
    if (!chunkedImages.length) {
        return null;
    }
    return (
        <Carousel className={'mt-2'}>
            {
                chunkedImages?.map((images, i) => (
                    <div key={i}>
                        <Row>
                            {
                                renderIndexing.map(i => {
                                    const paddingClass = i === 0
                                        ? 'mr-1'
                                        : i === 1
                                            ? 'mx-1'
                                            : 'ml-1';
                                    return (
                                        <Col flex={1} className={'aspect-video ' + paddingClass} key={images[i] ? images[i] : i}>
                                            <div className={'relative w-full h-full'}>
                                                { images[i] ?  <Image src={images[i]} alt={images[i]} fill={true} /> : null}
                                            </div>

                                        </Col>
                                    );
                                })
                            }
                        </Row>
                    </div>
                ))
            }
        </Carousel>
    );
};

const ServerMessageHandler = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const query = useSearchParamsObject<ServerQueryParams>();
    const path = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (query?.success) {
            messageApi.success(query.success);
            router.replace(path, {forceOptimisticNavigation: true});
        } else if (query?.error) {
            messageApi.error(query.error);
            router.push(path, {forceOptimisticNavigation: true});
        }
    }, [query, messageApi, router, path]);

    return contextHolder;
};

const CampaignDetailRender = ({ campaign }: CampaignDetailRenderProps) => {
    const chunkedImages = useMemo(() => {
        if (!campaign.imageUrls?.length) {
            return [] as string[][];
        }
        return chunk(campaign.imageUrls, 3);
    }, [campaign.imageUrls]);

    const percent = useMemo(() => Math.round(campaign.totalReceivedAmount / campaign.targetAmount * 100), [campaign]);

    const pathname = usePathname();

    const shareUrl = global?.window?.location?.href;

    return (
        <>
            <ServerMessageHandler />
            <h1 className={'text-2xl'}>{campaign.title}</h1>
            <div className={'text-lg'}>{campaign.description}</div>
            <div className={'mt-2'}>
                <TimeDisplay time={campaign.createdAt}
                             className={'italic'} />
            </div>
            <div className={'inline'}>
                <div className={'float-left'}>
                    <h3 className={'mb-1'}>Chia sẻ với bạn bè</h3>
                    <Space>
                        <FacebookShareButton
                            url={shareUrl} >
                            <FacebookOutlined style={{ color: '#3b5998', fontSize: '1.5rem' }} />
                        </FacebookShareButton>
                        <RedditShareButton
                            url={shareUrl} >
                            <RedditOutlined style={{ color: '#ff4500', fontSize: '1.5rem' }} />
                        </RedditShareButton>
                        <WhatsappShareButton
                            url={shareUrl} >
                            <WhatsAppOutlined style={{ color: '#25D366', fontSize: '1.5rem' }} />
                        </WhatsappShareButton>
                        <LinkedinShareButton
                            url={shareUrl} >
                            <LinkedinOutlined style={{ color: '#007fb1', fontSize: '1.5rem' }} />
                        </LinkedinShareButton>
                    </Space>
                </div>
                <ClientNeedAuth roles={[Role.ROLE_USER]}>
                    <div className={'ml-3 float-left'}>
                        <h3 className={'mb-1'}>&nbsp;</h3>
                        <SubscribeButton campaign={campaign} size={'small'} />
                    </div>
                </ClientNeedAuth>
            </div>
            <div className={'clear-both'}></div>
            {renderCarousel(chunkedImages)}
            <Row gutter={16} className={'mt-4'}>
                <Col md={16}>
                    <Card title={'Câu chuyện'}>
                        <ReactMarkdown className={'campaign-content'}>
                            {campaign.content}
                        </ReactMarkdown>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card title={'Thông tin quyên góp'}>
                        <strong className={'text-lg'}>
                            {campaign.totalReceivedAmountStr}
                        </strong>
                        /{campaign.targetAmountStr}

                        <Progress percent={percent} size={'small'} showInfo={false} />

                        <Row className={'mb-2'}>
                            <Col flex={1}>
                                <Statistic className={styles.statistic} title="Lượt quyên góp"
                                           value={campaign.totalDonations}/>
                            </Col>
                            <Col flex={1}>
                                <Statistic className={styles.statistic} title="Đạt được" value={`${percent}%`}/>
                            </Col>
                            <Col flex={1}>
                                <Statistic className={styles.statistic} title="Thời hạn còn" value={`${campaign.daysRemain} ngày`}/>
                            </Col>
                        </Row>
                        {
                            campaign.status === CampaignStatus.OPENING
                                ? <Link href={`${pathname}/donate`}>
                                    <Button type={'primary'} className={'w-full'} size={'large'}>
                                        Quyên góp
                                    </Button>
                                </Link>
                                : null
                        }

                        <Divider type={'horizontal'} />

                        <div>
                            <h4 className={'text-gray-400 font-normal'}>Đồng hành cùng dự án</h4>
                            <Space>
                                <Avatar src={campaign.organization?.avatarUrl} icon={<UserOutlined/>}/>
                                {campaign.organization?.name}
                            </Space>
                        </div>
                    </Card>
                </Col>
            </Row>

        </>

    )
};

export default CampaignDetailRender;