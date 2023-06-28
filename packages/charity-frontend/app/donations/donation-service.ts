import {BaseCRUDService} from "@/app/core/http/utils";
import Donation from "@/app/core/model/donation";
import Rest from "@/app/core/model/rest";
import PaymentInfo from "@/app/core/model/payment-info";
import Donor from "@/app/core/model/donor";

class DonationService extends BaseCRUDService<Donation> {
    getApiPath(): string {
        return '/api/v1/public/donations';
    }

    approve(id: number, transactionCode: string) {
        return this.axios.post<Rest<Donation>>('/api/v1/donations/' + id + '/approve', {transactionCode})
            .then(({data}) => data);
    }

    reject(id: number) {
        return this.axios.get<Rest<Donation>>('/api/v1/donations/' + id + '/reject')
            .then(({data}) => data);
    }

    protected getCreatePath(): string {
        return '/api/v1/public/donations';
    }

    getPaymentInfo(id: number) {
        return this.axios.get<Rest<PaymentInfo>>('/api/v1/public/donations/' + id + '/payment')
            .then(({data}) => data);
    }

    getDonors() {
        return this.axios.get<Rest<Donor[]>>('/api/v1/donors')
            .then(({data}) => data);
    }
}

export default DonationService;