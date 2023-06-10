'use client';

import Campaign from "@/app/core/model/campaign";
import ReactMarkdown from "react-markdown";
import {Carousel, Col, Row} from "antd";
import Image from "next/image";
import chunk from 'lodash/chunk';
import {useMemo} from "react";

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
    console.log(campaign);
    const chunkedImages = useMemo(() => {
        if (!campaign.imageUrls?.length) {
            return [] as string[][];
        }
        return chunk(campaign.imageUrls, 3);
    }, [campaign.imageUrls]);
    return (
        <>
            <h1 className={'text-2xl'}>{campaign.title}</h1>
            <div className={'text-lg'}>{campaign.description}</div>
            <div className={'mt-2'}>{campaign.createdAt}</div>
            {renderCarousel(chunkedImages)}
            <ReactMarkdown className={'campaign-content'}>
                {campaign.content}
            </ReactMarkdown>
        </>

    )
};

export default CampaignDetailRender;