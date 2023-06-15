import getCampaignBySlug from "@/app/campaigns/[slug]/helper";
import CampaignForm from "@/app/campaigns/form";

const EditCampaign = async ({ params: { slug }, searchParams }: any) => {
    const data = await getCampaignBySlug(slug);

    return <CampaignForm campaign={data} />
};

export default EditCampaign;