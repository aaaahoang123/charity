'use client';
import {Button} from "antd";
import {useRouter} from 'next/navigation';

const AccessDenied = () => {
    const router = useRouter();
    return (
        <div>
            Access denied
            <Button onClick={() => router.back()}>Back</Button>
        </div>
    );
};

export default AccessDenied;