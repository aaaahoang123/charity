'use client'

import {useState} from "react";
import {Select, SelectProps} from "antd";
import {useService} from "@/app/core/http-service";
import OrganizationService from "@/app/campaigns/organization-service";

export interface OrganizationSelectorProps extends Omit<SelectProps, 'options' | 'filterOption'> {}

const OrganizationSelector = ({ placeholder, showArrow, onSearch, ...props }: OrganizationSelectorProps) => {
    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState<string>();

    const service = useService(OrganizationService);

    const handleSearch = async (term: string) => {
        const value = await service.list({term});
        console.log(value);
    }

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };

    return (
        <Select
            showSearch
            value={value}
            placeholder={placeholder ?? 'Chọn cá nhân/tổ chức'}
            defaultActiveFirstOption={false}
            showArrow={showArrow ?? true}
            filterOption={false}
            onSearch={handleSearch}
            notFoundContent={null}
            options={(data || []).map((d) => ({
                value: d.value,
                label: d.text,
            }))}
            {...props}
        />
    );
};

export default OrganizationSelector;