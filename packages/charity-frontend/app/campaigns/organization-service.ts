import {BaseCRUDService} from "@/app/core/http-service";

class OrganizationService extends BaseCRUDService {
    getApiPath(): string {
        return '/api/v1/organizations';
    }

}

export default OrganizationService;