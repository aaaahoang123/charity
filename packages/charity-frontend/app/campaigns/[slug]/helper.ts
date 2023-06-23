import {getAccessToken} from "@/app/api/auth/[...nextauth]/route";
import {getAxiosInstance} from "@/app/core/http/utils";
import CampaignService from "@/app/campaigns/campaign-service";

const getCampaignBySlug = async (slug: string) => {
    const token = await getAccessToken();
    const axios = getAxiosInstance(token);
    const service = new CampaignService(axios);
    service.setStatus('authenticated');
    const {data} = await service.detail(slug);

    return data;
};

export default getCampaignBySlug;