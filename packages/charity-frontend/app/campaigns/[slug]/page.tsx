import {getAccessToken} from "@/app/api/auth/[...nextauth]/route";
import {getAxiosInstance} from "@/app/core/http/utils";
import CampaignService from "@/app/campaigns/campaign-service";
import CampaignDetailRender from "@/app/campaigns/[slug]/page-render";

const CampaignDetail = async ({ params, searchParams }: any) => {
    const {slug} = params;
    const token = await getAccessToken();

    const axios = getAxiosInstance(token);
    const service = new CampaignService(axios);
    service.setStatus('authenticated');
    const {data} = await service.detail(slug);

    return (
        <CampaignDetailRender campaign={data} />
    );
};

export default CampaignDetail;