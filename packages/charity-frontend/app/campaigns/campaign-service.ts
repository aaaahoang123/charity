import Campaign from "@/app/core/model/campaign";
import {BaseCRUDService} from "@/app/core/http/utils";

class CampaignService extends BaseCRUDService<Campaign> {
    getApiPath(): string {
        return '/api/v1/campaigns';
    }
}

export default CampaignService;