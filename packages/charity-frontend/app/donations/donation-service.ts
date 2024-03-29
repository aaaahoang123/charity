import {BaseCRUDService} from "@/app/core/http/utils";
import Donation from "@/app/core/model/donation";
import Rest from "@/app/core/model/rest";
import PaymentInfo from "@/app/core/model/payment-info";
import Donor from "@/app/core/model/donor";
import {DonationStatistic} from "@/app/core/model/donation-statistic";
import {TopDonor} from "@/app/core/model/top-donor";

class DonationService extends BaseCRUDService<Donation> {
    getApiPath(): string {
        return '/api/v1/public/donations';
    }

    approve(id: number, transactionCode: string) {
        return this.waitForReady(
            () => this.doFetch<Rest<Donation>>('/api/v1/donations/' + id + '/approve', {
                method: 'POST',
                body: JSON.stringify({transactionCode})
            })
        );
    }

    reject(id: number) {
        return this.waitForReady(
            () => this.doFetch<Rest<Donation>>('/api/v1/donations/' + id + '/reject')
        );
    }

    statistics() {
        return this.waitForReady(
            () => this.doFetch<Rest<DonationStatistic[]>>('/api/v1/public/donations/statistics')
        )
    }

    protected getCreatePath(): string {
        return '/api/v1/public/donations';
    }

    getPaymentInfo(id: number) {
        return this.waitForReady(
            () => this.doFetch<Rest<PaymentInfo>>('/api/v1/public/donations/' + id + '/payment')
        );
    }

    getDonors() {
        return this.waitForReady(
            () => this.doFetch<Rest<Donor[]>>('/api/v1/donors')
        );
    }

    findTopDonors() {
        return this.waitForReady(
            () => this.doFetch<Rest<TopDonor[]>>('/api/v1/public/donations/top-donors')
        );
    }
}

export default DonationService;