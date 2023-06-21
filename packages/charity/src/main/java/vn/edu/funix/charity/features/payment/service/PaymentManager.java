package vn.edu.funix.charity.features.payment.service;

import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

public interface PaymentManager {
    PaymentService getPaymentService(Donation donation);
    PaymentInfo getPaymentInfo(Donation donation);
}
