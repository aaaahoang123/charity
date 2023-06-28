'use client';

import {DonationStatus} from "@/app/core/model/donation";
import {Tag} from "antd";

export interface DonationStatusTagProps {
    status: DonationStatus;
}

const translate = {
    [DonationStatus.INITIAL]: 'Mới tạo',
    [DonationStatus.PROVIDER_TRANSACTION_CREATED]: 'Đã tạo giao dịch',
    [DonationStatus.CONFIRMED]: 'Thành công',
    [DonationStatus.REJECTED]: 'Thất bại',
};

const colorMap = {
    [DonationStatus.INITIAL]: '#108ee9',
    [DonationStatus.PROVIDER_TRANSACTION_CREATED]: '#2db7f5',
    [DonationStatus.CONFIRMED]: '#87d068',
    [DonationStatus.REJECTED]: '#f50',
};

const DonationStatusTag = ({status}: DonationStatusTagProps) => {
    // <Tag color="#f50">#f50</Tag>
    // <Tag color="#2db7f5">#2db7f5</Tag>
    // <Tag color="#87d068">#87d068</Tag>
    // <Tag color="#108ee9">#108ee9</Tag>
    return (
        <Tag color={colorMap[status]}>
            {translate[status]}
        </Tag>
    );
};

export default DonationStatusTag;