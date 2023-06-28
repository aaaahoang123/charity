package vn.edu.funix.charity.features.payment.service;

import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.Map;

@Component
@AllArgsConstructor
public class PaymentManagerImpl implements PaymentManager {
    private final ApplicationContext context;
    private final Map<TransactionProvider, Class<? extends PaymentService>> serviceMap = Map.of(
            TransactionProvider.TRANSFER, TransferPaymentService.class,
            TransactionProvider.MOMO, MomoPaymentService.class,
            TransactionProvider.PAYPAL, PaypalPaymentService.class,
            TransactionProvider.VN_PAY, VNPayPaymentService.class
    );
    @Override
    public PaymentService getPaymentService(Donation donation) {
        var serviceName = serviceMap.get(donation.getTransactionProvider());
        return context.getBean(serviceName);
    }

    @Override
    public PaymentInfo getPaymentInfo(Donation donation) throws Exception {
        return getPaymentService(donation).generatePaymentInfo(donation);
    }

    @Override
    public String confirmPayment(Donation donation, Map<String, Object> meta) {
        return getPaymentService(donation).confirmPayment(donation, meta);
    }
}
