package vn.edu.funix.charity.features.payment.service;

import com.paypal.base.rest.PayPalRESTException;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

public interface PaymentManager {
    PaymentService getPaymentService(Donation donation);
    PaymentInfo getPaymentInfo(Donation donation) throws Exception;
}
