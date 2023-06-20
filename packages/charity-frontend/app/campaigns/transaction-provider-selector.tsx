import {Radio, RadioGroupProps} from "antd";
import {TransactionProvider} from "@/app/core/model/donation";
import {forwardRef} from "react";

const translate: any = {
    [TransactionProvider.TRANSFER]: 'Chuyển khoản',
    [TransactionProvider.PAYPAL]: 'Paypal',
    [TransactionProvider.MOMO]: 'Momo',
    [TransactionProvider.VN_PAY]: 'VnPay',
};

const InnerTransactionProviderSelector = ({...props}: RadioGroupProps, ref: any) => {
    return (
        <Radio.Group
            ref={ref}
            optionType={'button'}
            buttonStyle={'solid'}
            options={
                Object.entries(TransactionProvider)
                    .map(([k, v]) => ({
                        label: translate[k] ?? k,
                        value: v,
                    }))
            }
            {...props}
        />
    )
};

const TransactionProviderSelector = forwardRef(InnerTransactionProviderSelector);

export default TransactionProviderSelector;