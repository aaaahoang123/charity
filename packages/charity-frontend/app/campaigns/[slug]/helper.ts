import {getAccessToken} from "@/app/api/auth/[...nextauth]/route";
import CampaignService from "@/app/campaigns/campaign-service";
import Logger from "js-logger";

const logger = Logger.get('CampaignDetailHelper');

const getCampaignBySlug = async (slug: string) => {
    const token = await getAccessToken();
    const service = new CampaignService(token);
    service.setStatus('authenticated');
    const {data} = await service.detail(slug);
    logger.info('Load campaign detail success: ' + data.title);
    return data;
};

export default getCampaignBySlug;