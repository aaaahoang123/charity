'use client';

import {Select, SelectProps} from "antd";
import {useSession} from "next-auth/react";
import {forwardRef} from "react";
import {DonationStatus} from "@/app/core/model/donation";

const translate: any = {
    [DonationStatus.INITIAL]: 'Mới tạo',
    [DonationStatus.PROVIDER_TRANSACTION_CREATED]: 'Đã tạo giao dịch',
    [DonationStatus.CONFIRMED]: 'Thành công',
    [DonationStatus.REJECTED]: 'Thất bại',
};

const InnerDonationStatusSelector = ({placeholder, ...props}: SelectProps, ref: any) => {
    const {data: session} = useSession();

    return (
        <Select
            placeholder={placeholder ?? 'Chọn trạng thái'}
            ref={ref}
            options={
                Object.entries(DonationStatus)
                    .map(([k, v]) => ({
                        label: translate[k] ?? k,
                        value: v,
                    }))
            }
            {...props}
        />
    )
};

const DonationStatusSelector = forwardRef(InnerDonationStatusSelector);

export default DonationStatusSelector;
