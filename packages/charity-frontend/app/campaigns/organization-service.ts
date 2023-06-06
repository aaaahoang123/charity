import Organization from "@/app/core/model/organization";
import {BaseCRUDService} from "@/app/core/http/utils";

class OrganizationService extends BaseCRUDService<Organization> {
    getApiPath(): string {
        return '/api/v1/organizations';
    }

}

export default OrganizationService;