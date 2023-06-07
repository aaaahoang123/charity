import Campaign from "@/app/core/model/campaign";
import {BaseCRUDService} from "@/app/core/http/utils";
import Rest from "@/app/core/model/rest";

class CampaignService extends BaseCRUDService<Campaign> {
    getApiPath(): string {
        return '/api/v1/campaigns';
    }

    list(params: any): Promise<Rest<Campaign[]>> {
        return this.waitForReady(
            () => this.axios.get<Rest<Campaign[]>>('/api/v1/public/campaigns', {
                params,
            }).then(({data}) => data)
        );
    }
}

export default CampaignService;