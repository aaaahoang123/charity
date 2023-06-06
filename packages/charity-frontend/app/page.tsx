import {getServerSession} from "next-auth";
import {getAxiosInstance} from "@/app/core/http/utils";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import CampaignService from "@/app/campaigns/campaign-service";
import HomeRender from "@/app/page-render";

export default async function Home({params, searchParams}) {
  const session = await getServerSession(authOptions);
  const axios = getAxiosInstance(session.accessToken);
  const service = new CampaignService(axios);
  service.setStatus('authenticated');

  const {data, meta} = await service.list(searchParams);

  return (
    <HomeRender campaigns={data} pagination={meta} />
  );
}
