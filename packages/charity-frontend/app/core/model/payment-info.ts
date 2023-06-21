import {TransactionProvider} from "@/app/core/model/donation";

export enum PaymentOpenType {
    MODAL = 'MODAL',
    HREF = 'HREF',

}
export interface TransferPaymentInfo {
    amount: string;
    number: string;
    bank: string;
    addInfo: string;
    name: string;
}
interface PaymentInfo {
    url: string;
    openType: PaymentOpenType;
    provider: TransactionProvider;
    meta: TransferPaymentInfo;
}

export default PaymentInfo;