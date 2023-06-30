import Organization from "@/app/core/model/organization";

export enum CampaignStatus {
    INITIAL = 'INITIAL',
    OPENING = 'OPENING',
    COMPLETED = 'COMPLETED',
    CLOSED = 'CLOSED',
}

interface Campaign {
    id: number;
    createdByUserId: string;
    images?: string[];
    targetAmount: number;
    targetAmountStr: string;
    description: string;
    title: string;
    content: string;
    organizationId: number;
    createdAt: string;
    deletedAt: null;
    organization: Organization;
    lastUpdatedByUserId: string;
    imageUrls?: string[];
    deadline: string;
    slug: string;
    status: CampaignStatus;
    updatedAt: string;
    daysRemain: number;
    totalReceivedAmount: number;
    totalDonations: number;
    totalReceivedAmountStr: string;
    isSubscribed: boolean;
}

export default Campaign;