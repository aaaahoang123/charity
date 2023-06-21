package vn.edu.funix.charity.features.payment.service;

import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

public interface PaymentService {
    PaymentInfo generatePaymentInfo(Donation donation);

    boolean isSuccessPayment(Donation donation);
}
