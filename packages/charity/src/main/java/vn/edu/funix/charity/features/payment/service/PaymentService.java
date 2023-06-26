package vn.edu.funix.charity.features.payment.service;

import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.util.Map;

public interface PaymentService {
    PaymentInfo generatePaymentInfo(Donation donation) throws Exception;

    default String confirmPayment(Donation donation, Map<String, Object> meta) {
        return null;
    }

    default String getRedirectUri(Donation donation) {
        return "/public/payment/redirect/" + donation.getId() + "/accept";
    }
}
