interface Organization {
    id: number;
    createdAt: string;
    deletedAt?: string;
    email: string;
    name?: string;
    avatar?: string;
    avatarUrl?: string;
    phoneNumber: string;
    updatedAt: string;
}

export default Organization;