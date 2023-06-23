package vn.edu.funix.charity.features.payment.service;

import com.paypal.base.rest.PayPalRESTException;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.Map;

public interface PaymentService {
    PaymentInfo generatePaymentInfo(Donation donation) throws Exception;

    default boolean isSuccessPayment(Donation donation, Map<String, Object> meta) {
        return false;
    }
}
