package vn.edu.funix.charity.features.payment.service;

import org.springframework.stereotype.Service;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

@Service("momoPaymentService")
public class MomoPaymentService implements PaymentService {
    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) {
        return null;
    }

    @Override
    public boolean isSuccessPayment(Donation donation) {
        return false;
    }
}
