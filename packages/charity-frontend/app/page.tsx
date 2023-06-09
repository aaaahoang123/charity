import {getAccessToken} from "@/app/api/auth/[...nextauth]/route";
import CampaignService from "@/app/campaigns/campaign-service";
import HomeRender from "@/app/page-render";

export default async function Home({params, searchParams}: any) {
    const token = await getAccessToken();
    const service = new CampaignService(token);
    service.setStatus('authenticated');

    const {data, meta} = await service.list(searchParams);

    return (
        <>
            <HomeRender campaigns={data} pagination={meta}/>
        </>
    );
}
