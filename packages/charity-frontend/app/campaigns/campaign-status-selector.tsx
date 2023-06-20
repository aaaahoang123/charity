'use client';

import {Select, SelectProps} from "antd";
import {CampaignStatus} from "@/app/core/model/campaign";
import {sessionMatchAnyRoles} from "@/app/api/auth/[...nextauth]/route";
import {Role} from "@/app/core/role";
import {useSession} from "next-auth/react";
import {forwardRef} from "react";

const translate: any = {
    [CampaignStatus.INITIAL]: 'Mới tạo',
    [CampaignStatus.OPENING]: 'Đang quyên góp',
    [CampaignStatus.COMPLETED]: 'Kết thúc quyên góp',
    [CampaignStatus.CLOSED]: 'Đóng quyên góp',
};

const InnerCampaignStatusSelector = ({placeholder, ...props}: SelectProps, ref: any) => {
    const {data: session} = useSession();

    return (
        <Select
            placeholder={placeholder ?? 'Chọn trạng thái'}
            ref={ref}
            options={
                Object.entries(CampaignStatus)
                    .filter(([k]) =>
                        sessionMatchAnyRoles(session, [Role.ROLE_ADMIN]) === true
                        || k !== CampaignStatus.INITIAL
                    )
                    .map(([k, v]) => ({
                        label: translate[k] ?? k,
                        value: v,
                    }))
            }
            {...props}
        />
    )
};

const CampaignStatusSelector = forwardRef(InnerCampaignStatusSelector);

export default CampaignStatusSelector;
