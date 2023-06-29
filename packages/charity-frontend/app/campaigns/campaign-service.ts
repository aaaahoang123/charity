import Campaign from "@/app/core/model/campaign";
import {BaseCRUDService} from "@/app/core/http/utils";
import Rest from "@/app/core/model/rest";

class CampaignService extends BaseCRUDService<Campaign> {
    getApiPath(): string {
        return '/api/v1/campaigns';
    }

    protected getListPath(): string {
        return '/api/v1/public/campaigns';
    }

    protected getDetailPath(id: string | number): string {
        return this.getListPath() + `/${id}`;
    }

    triggerSubscribe(slug: string) {
        return this.axios.get<Rest<Campaign>>(`/api/v1/public/campaigns/${slug}/subscribe`)
            .then(({data}) => data);
    }
}

export default CampaignService;