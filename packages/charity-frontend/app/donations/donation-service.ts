import {BaseCRUDService} from "@/app/core/http/utils";
import Donation from "@/app/core/model/donation";

class DonationService extends BaseCRUDService<Donation> {
    getApiPath(): string {
        return '/api/v1/public/donations';
    }

}

export default DonationService;