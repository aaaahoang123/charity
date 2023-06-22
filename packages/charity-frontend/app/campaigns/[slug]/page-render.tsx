'use client';

import Campaign from "@/app/core/model/campaign";
import ReactMarkdown from "react-markdown";
import {Avatar, Button, Card, Carousel, Col, Divider, Progress, Row, Space, Statistic} from "antd";
import Image from "next/image";
import chunk from 'lodash/chunk';
import {useMemo} from "react";
import styles from "@/app/page-render.module.scss";
import {UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {usePathname} from "next/navigation";

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

const CampaignDetailRender = ({campaign}: CampaignDetailRenderProps) => {
    const chunkedImages = useMemo(() => {
        if (!campaign.imageUrls?.length) {
            return [] as string[][];
        }
        return chunk(campaign.imageUrls, 3);
    }, [campaign.imageUrls]);

    const percent = useMemo(() => Math.round(campaign.totalReceivedAmount / campaign.targetAmount), [campaign]);

    const pathname = usePathname();
    return (
        <>
            <h1 className={'text-2xl'}>{campaign.title}</h1>
            <div className={'text-lg'}>{campaign.description}</div>
            <div className={'mt-2'}>{campaign.createdAt}</div>
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

                        <Button type={'primary'} className={'w-full'} size={'large'}>
                            <Link href={`${pathname}/donate`}>
                                Quyên góp
                            </Link>
                        </Button>

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