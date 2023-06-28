import {Radio, RadioGroupProps, Select, SelectProps} from "antd";
import {DonationStatus, TransactionProvider} from "@/app/core/model/donation";
import {forwardRef, useMemo} from "react";

type RadioSelectorProps = {
    type?: 'radio'
} & RadioGroupProps;

type SelectSelectorProps = {
    type?: 'select'
} & SelectProps;

export type TransactionProviderProps = RadioSelectorProps | SelectSelectorProps;

const translate: any = {
    [TransactionProvider.TRANSFER]: 'Chuyển khoản',
    [TransactionProvider.PAYPAL]: 'Paypal',
    [TransactionProvider.MOMO]: 'Momo',
    [TransactionProvider.VN_PAY]: 'VnPay',
};

const options: any = Object.entries(TransactionProvider)
    .map(([k, v]) => ({
        label: translate[k] ?? k,
        value: v,
    }));

const InnerTransactionProviderSelector = ({type, ...props}: TransactionProviderProps, ref: any) => {
    if (!type || type === 'radio') {
        return (
            <Radio.Group
                ref={ref}
                optionType={'button'}
                buttonStyle={'solid'}
                options={options}
                {...props as RadioSelectorProps}
            />
        );
    }

    const {placeholder, ...others} = props as SelectSelectorProps;
    return (
        <Select
            placeholder={placeholder ?? 'Chọn hình thức'}
            ref={ref}
            options={options}
            {...others}
        />
    )
};

const TransactionProviderSelector = forwardRef(InnerTransactionProviderSelector);

export default TransactionProviderSelector;