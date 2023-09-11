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

    protected getUpdatePath(id: string | number): string {
        return this.getApiPath() + `/${id}`;
    }

    triggerSubscribe(slug: string) {
        return this.waitForReady(
            () => this.doFetch<Rest<Campaign>>(`/api/v1/campaigns/${slug}/subscribe`)
        );
    }

    triggerSendMail(slug: string) {
        return this.waitForReady(
            () => this.doFetch<Rest<Campaign>>(`/api/v1/campaigns/${slug}/trigger-send-mail`)
        );
    }

    statistics() {
        return this.waitForReady(
            () => this.doFetch<Rest<any>>('/api/v1/public/campaigns/statistics')
        );
    }
}

export default CampaignService;