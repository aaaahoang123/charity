'use client';

import {Button, message, Popconfirm} from "antd";
import Campaign from "@/app/core/model/campaign";
import {useService} from "@/app/core/http/components";
import CampaignService from "@/app/campaigns/campaign-service";
import {useCallback} from "react";
import {useRouter} from 'next/navigation';
import Logger from "js-logger";

const logger = Logger.get('DeleteCampaignBtn');

export interface DeleteCampaignBtnProps {
    campaign: Campaign;
}

const DeleteCampaignBtn = ({campaign}: DeleteCampaignBtnProps) => {
    const service = useService(CampaignService);
    const router = useRouter();

    const onOk = useCallback(() => {
        service.delete(campaign.slug)
            .then(() => {
                router.refresh();
            })
            .catch(e => {
                logger.error(e);
                message.error(e.message);
            });
    }, [service, campaign.slug, router]);

    return (
        <Popconfirm title={`Bạn chắc chắn muốn xoá đợt quyên góp ${campaign.title} chứ?`}
                    onConfirm={onOk}
        >
            <Button type={'dashed'}
                    danger={true}
                    size={'small'}
                    className={'mb-1'}
                    onClick={(e) => e.preventDefault()}
            >
                Xoá
            </Button>
        </Popconfirm>

    );
};

export default DeleteCampaignBtn;
