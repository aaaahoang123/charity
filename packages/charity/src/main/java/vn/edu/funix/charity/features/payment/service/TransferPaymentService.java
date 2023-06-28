package vn.edu.funix.charity.features.payment.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.util.CurrencyFormatter;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.PaymentConfiguration;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

@Service("transferPaymentService")
@AllArgsConstructor
public class TransferPaymentService implements PaymentService, CurrencyFormatter {
    private PaymentConfiguration configuration;
    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) {
        var url = "https://img.vietqr.io/image/" +
                configuration.getTransfer().getBank() +
                "-" +
                configuration.getTransfer().getNumber() +
                "-" +
                configuration.getTransfer().getTemplateType() +
                ".jpg?amount=" +
                donation.getAmount() +
                "&addInfo=DNC " +
                donation.getId() +
                "&accountName=" +
                configuration.getTransfer().getName();

        var openType = PaymentInfo.PaymentInfoOpenType.MODAL;
        var provider = donation.getTransactionProvider();

        return new PaymentInfo(url, openType, provider, null, null);
    }
}
