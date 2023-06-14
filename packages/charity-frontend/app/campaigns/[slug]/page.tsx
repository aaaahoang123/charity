import CampaignDetailRender from "@/app/campaigns/[slug]/page-render";
import getCampaignBySlug from "@/app/campaigns/[slug]/helper";

const CampaignDetail = async ({ params: { slug }, searchParams }: any) => {
    const data = await getCampaignBySlug(slug);

    return (
        <CampaignDetailRender campaign={data} />
    );
};

export default CampaignDetail;