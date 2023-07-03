import {TransactionProvider} from "@/app/core/model/donation";

const translate: any = {
    [TransactionProvider.TRANSFER]: 'Chuyển khoản',
    [TransactionProvider.PAYPAL]: 'Paypal',
    [TransactionProvider.MOMO]: 'Momo',
    [TransactionProvider.VN_PAY]: 'VnPay',
};

export interface TransactionProviderLabelProps {
    provider: TransactionProvider;
}

const TransactionProviderLabel = ({provider}: TransactionProviderLabelProps) => {
    return (
        <>
            {translate[provider]}
        </>
    );
};

export default TransactionProviderLabel