import {getAccessToken} from "@/app/api/auth/[...nextauth]/route";
import DonationService from "@/app/donations/donation-service";
import DonationPageRender from "@/app/donations/page-render";

const DonationPage = async ({params, searchParams}: any) => {
    const token = await getAccessToken();
    const service = new DonationService(token);
    service.setStatus('authenticated');

    const {data, meta} = await service.list(searchParams);

    return (
        <DonationPageRender donations={data} pagination={meta} />
    );
};

export default DonationPage;