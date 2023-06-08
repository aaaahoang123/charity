import Organization from "@/app/core/model/organization";

interface Campaign {
    id: number;
    createdByUserId: string;
    images?: string;
    targetAmount: number;
    description: string;
    title: string;
    content: string;
    organizationId: number;
    createdAt: string;
    deletedAt: null;
    organization: Organization;
    lastUpdatedByUserId: string;
    imageUrls?: string;
    deadline: string;
    slug: string;
    status: string;
    updatedAt: string;
    daysRemain: number;
}

export default Campaign;