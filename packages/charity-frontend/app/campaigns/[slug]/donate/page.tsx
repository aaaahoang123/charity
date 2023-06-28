import getCampaignBySlug from "@/app/campaigns/[slug]/helper";
import DonateRender from "@/app/campaigns/[slug]/donate/page-render";

const DonateCampaign = async ({ params: { slug }, searchParams }: any) => {
    const data = await getCampaignBySlug(slug);

    return <DonateRender campaign={data} />;
};

export default DonateCampaign;