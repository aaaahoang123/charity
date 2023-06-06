import {BaseCRUDService} from "@/app/core/http-service";
import Campaign from "@/app/core/model/campaign";

class CampaignService extends BaseCRUDService<Campaign> {
    getApiPath(): string {
        return '/api/v1/campaigns';
    }
}

export default CampaignService;