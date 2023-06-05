import {BaseCRUDService} from "@/app/core/http-service";
import Organization from "@/app/core/model/organization";

class OrganizationService extends BaseCRUDService<Organization> {
    getApiPath(): string {
        return '/api/v1/organizations';
    }

}

export default OrganizationService;