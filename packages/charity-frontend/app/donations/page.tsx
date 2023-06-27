import {getAccessToken} from "@/app/api/auth/[...nextauth]/route";
import {getAxiosInstance} from "@/app/core/http/utils";
import DonationService from "@/app/donations/donation-service";
import DonationPageRender from "@/app/donations/page-render";

const DonationPage = async ({params, searchParams}: any) => {
    const token = await getAccessToken();
    const axios = getAxiosInstance(token);
    const service = new DonationService(axios);
    service.setStatus('authenticated');

    const {data, meta} = await service.list(searchParams);

    return (
        <DonationPageRender donations={data} pagination={meta} />
    );
};

export default DonationPage;