import {Radio, RadioGroupProps, Select, SelectProps} from "antd";
import {TransactionProvider} from "@/app/core/model/donation";
import {forwardRef} from "react";
import TransactionProviderLabel from "@/app/campaigns/transaction-provider-label";

type RadioSelectorProps = {
    type?: 'radio'
} & RadioGroupProps;

type SelectSelectorProps = {
    type?: 'select'
} & SelectProps;

export type TransactionProviderProps = RadioSelectorProps | SelectSelectorProps;

const options: any = Object.entries(TransactionProvider)
    .map(([, v]) => ({
        label: <TransactionProviderLabel provider={v} />,
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