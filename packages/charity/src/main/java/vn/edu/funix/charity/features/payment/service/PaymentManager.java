package vn.edu.funix.charity.features.payment.service;

import com.paypal.base.rest.PayPalRESTException;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.Map;

public interface PaymentManager {
    PaymentService getPaymentService(Donation donation);
    PaymentInfo getPaymentInfo(Donation donation) throws Exception;
    String confirmPayment(Donation donation, Map<String, Object> meta);
}
