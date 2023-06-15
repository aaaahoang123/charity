'use client'

import {useCallback, useEffect, useMemo, useState} from "react";
import {Avatar, Select, SelectProps, Spin} from "antd";
import {useService} from "@/app/core/http/components";
import OrganizationService from "@/app/campaigns/organization-service";
import debounce from 'lodash/debounce';
import Organization from "@/app/core/model/organization";

export interface OrganizationSelectorProps extends Omit<SelectProps, 'options' | 'filterOption'> {
    onSelectObject?: (_: any) => any;
}

const OrganizationSelector = ({ placeholder, showArrow, onSearch, onChange, onSelectObject, allowClear, ...props }: OrganizationSelectorProps) => {
    const [data, setData] = useState<Organization[]>([]);
    const [options, setOptions] = useState<SelectProps['options']>([]);
    const service = useService(OrganizationService);
    const [fetching, setFetching] = useState(false);

    const doRequest = useCallback((term?: string) => {
        setFetching(true);
        setOptions([]);
        service.list({term})
            .then(result => {
                const data = result.data;
                const options: SelectProps['options'] = data?.map((d) => ({
                    label: (
                        <>
                            <Avatar src={d.avatarUrl} size={18}>
                                {d.name?.slice(0, 1)}
                            </Avatar> {d.name} - {d.phoneNumber}
                        </>
                    ),
                    value: d.id,
                }));
                setData(data);
                setOptions(options);
                setFetching(false);
            })
            .catch(e => console.log(e));
    }, [service, setData, setOptions, setFetching]);

    useEffect(() => {
        doRequest();
    }, [doRequest]);

    const handleSearch = useMemo(() => {
        return debounce(doRequest, 1000);
    }, [doRequest]);

    const handleChange = useCallback<NonNullable<SelectProps['onChange']>>((value, option) => {
        onChange?.(value, option);
        onSelectObject?.(data?.find(d => d.id === value ));
    }, [onChange, onSelectObject, data]);

    return (
        <Select
            showSearch
            placeholder={placeholder ?? 'Chọn cá nhân/tổ chức'}
            defaultActiveFirstOption={false}
            showArrow={showArrow ?? true}
            filterOption={false}
            onSearch={handleSearch}
            notFoundContent={fetching ? <Spin size={'small'} /> : null}
            options={options}
            onChange={handleChange}
            allowClear={allowClear ?? true}
            {...props}
        />
    );
};

export default OrganizationSelector;