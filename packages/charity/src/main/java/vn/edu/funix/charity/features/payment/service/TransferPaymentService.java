package vn.edu.funix.charity.features.payment.service;

import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.util.CurrencyFormatter;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.PaymentConfiguration;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.Map;

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
                "&addInfo=" +
                donation.getTransactionCode() +
                "&accountName=" +
                configuration.getTransfer().getName();

        var openType = PaymentInfo.PaymentInfoOpenType.MODAL;
        var provider = donation.getTransactionProvider();
        Map<String, Object> meta = Map.of(
                "bank", StringUtils.capitalize(configuration.getTransfer().getBank()),
                "number", configuration.getTransfer().getNumber(),
                "name", configuration.getTransfer().getName(),
                "amount", formatCurrency(donation.getAmount()),
                "addInfo", donation.getTransactionCode()
        );

        return new PaymentInfo(url, openType, provider, meta);
    }

    @Override
    public boolean isSuccessPayment(Donation donation) {
        return false;
    }
}
