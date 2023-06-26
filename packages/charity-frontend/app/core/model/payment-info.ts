import {TransactionProvider} from "@/app/core/model/donation";

export enum PaymentOpenType {
    MODAL = 'MODAL',
    HREF = 'HREF',

}

interface PaymentInfo {
    url: string;
    openType: PaymentOpenType;
    provider: TransactionProvider;
    confirmMessage?: string;
    meta?: any;
}

export default PaymentInfo;