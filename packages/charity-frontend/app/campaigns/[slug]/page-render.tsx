'use client';

import Campaign from "@/app/core/model/campaign";
import ReactMarkdown from "react-markdown";

export interface CampaignDetailRenderProps {
    campaign: Campaign;
}

const CampaignDetailRender = ({campaign}: CampaignDetailRenderProps) => {
    return (
        <ReactMarkdown>
            {campaign.content}
        </ReactMarkdown>
    )
};

export default CampaignDetailRender;