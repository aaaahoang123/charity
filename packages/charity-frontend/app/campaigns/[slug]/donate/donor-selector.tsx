import {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {Select, SelectProps} from "antd";
import {useSession} from "next-auth/react";
import {useService} from "@/app/core/http/components";
import DonationService from "@/app/donations/donation-service";
import Donor from "@/app/core/model/donor";
import kebabCase from 'lodash/kebabCase';

export interface DonorSelectorProps extends SelectProps {
    onSelectDonor?: (donor?: Donor) => any;
}

const defaultFilterOption: SelectProps['filterOption'] = (input, option) =>
    kebabCase(option
        ?.label
        ?.toString()
    ).includes(input);

const defaultFilterSort: SelectProps['filterSort']
    = (optionA, optionB) =>
    kebabCase(optionA.label ?? '' as any)
        .localeCompare(kebabCase(optionB.label ?? '' as any));

const InnerDonorSelector = ({
                                onSelectDonor,
                                placeholder,
                                onSelect,
                                onClear,
                                showSearch,
                                filterOption,
                                filterSort,
                                ...props
                            }: DonorSelectorProps, ref: any) => {
    const {status} = useSession();
    const service = useService(DonationService);
    const [data, setData] = useState<Donor[]>();
    const options = useMemo<SelectProps['options']>(
        () => data?.map(d => ({
            label: (d.name ? d.name + ' - ' : '')
                + (d.phoneNumber ? d.phoneNumber + ' - ' : '')
                + (d.email ?? ''),
            value: d.id,
        })), [data]
    );

    const onSelectWrapper = useCallback((value: number, option: any) => {
        onSelectDonor?.(data?.find(d => d.id === value));
        onSelect?.(value, option);
    }, [data, onSelectDonor, onSelect]);

    const onClearWrapper = useCallback(() => {
        onClear?.();
        onSelectDonor?.();
    }, [onSelectDonor, onClear]);
    useEffect(() => {
        if (status !== 'authenticated') {
            return;
        }

        service.getDonors()
            .then(res => {
                setData(res.data);
            });

    }, [service, status]);

    if (status !== 'authenticated') {
        return null;
    }

    return (
        <Select ref={ref}
                options={options}
                onSelect={onSelectWrapper}
                onClear={onClearWrapper}
                placeholder={placeholder ?? 'Chọn thông tin quyên góp'}
                showSearch={showSearch ?? true}
                filterOption={filterOption ?? defaultFilterOption}
                filterSort={filterSort ?? defaultFilterSort}
                {...props}
        ></Select>
    );
};

const DonorSelector = forwardRef(InnerDonorSelector);

export default DonorSelector;