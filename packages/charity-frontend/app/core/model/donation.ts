import Donor from "@/app/core/model/donor";
import Campaign from "@/app/core/model/campaign";

export enum TransactionProvider {
    TRANSFER = 'TRANSFER',
    MOMO = 'MOMO',
    VN_PAY = 'VN_PAY',
    PAYPAL = 'PAYPAL',
}

export enum DonationStatus {
    INITIAL = 'INITIAL',
    PROVIDER_TRANSACTION_CREATED = 'PROVIDER_TRANSACTION_CREATED',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
}

interface Donation {
    id: number;
    amount: number;
    message: string;
    transactionCode: string;
    transactionProvider: TransactionProvider;
    status: DonationStatus;
    donorId?: number;
    donor?: Donor;
    campaignId: number;
    campaign: Campaign;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    confirmedAt?: string;
    createdByUserId?: string;
    lastUpdatedByUserId?: string;
}

export default Donation;