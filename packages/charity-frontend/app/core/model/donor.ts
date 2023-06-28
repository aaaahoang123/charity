
interface Donor {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    createdByUserId?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export default Donor;