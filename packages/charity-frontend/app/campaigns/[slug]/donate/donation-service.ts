import {BaseCRUDService} from "@/app/core/http/utils";
import Donation from "@/app/core/model/donation";
import Rest from "@/app/core/model/rest";
import PaymentInfo from "@/app/core/model/payment-info";

class DonationService extends BaseCRUDService<Donation> {
    getApiPath(): string {
        return '/api/v1/donations';
    }

    protected getCreatePath(): string {
        return '/api/v1/public/donations';
    }

    getPaymentInfo(id: number) {
        return this.axios.get<Rest<PaymentInfo>>('/api/v1/public/donations/' + id + '/payment')
            .then(({data}) => data);
    }
}

export default DonationService;
