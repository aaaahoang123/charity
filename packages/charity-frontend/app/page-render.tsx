'use client';

import Campaign from "@/app/core/model/campaign";
import {RestMeta} from "@/app/core/model/rest";
import {Card, Col, Row} from "antd";
import Image from "next/image";

export interface HomeRenderProps {
    campaigns: Campaign[];
    pagination?: RestMeta;
}

export const CampaignItem = ({campaign}: {campaign: Campaign}) => {
    return (
        <Card>
            <Image src={campaign.imageUrls?.[0]} alt={campaign.title} fill={true} />
        </Card>
    )
};

const HomeRender = ({campaigns, pagination}: HomeRenderProps) => {
    return (
        <Card title={<div className={'text-center'}>Những hoàn cảnh khó khăn</div>}>
            <Row gutter={8}>
                <Col xs={24} lg={8} md={12}>
                    {campaigns.map(c => <CampaignItem campaign={c} key={c.id} />)}
                </Col>
            </Row>
        </Card>
    )
};

export default HomeRender;