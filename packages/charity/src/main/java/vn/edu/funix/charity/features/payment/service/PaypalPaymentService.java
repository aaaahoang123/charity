package vn.edu.funix.charity.features.payment.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service("paypalPaymentService")
@AllArgsConstructor
public class PaypalPaymentService implements PaymentService {
    private final APIContext context;
    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) throws PayPalRESTException {
        var amount = new Amount();
        amount.setCurrency("USD");
        var total = new BigDecimal(100)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        amount.setTotal(String.format("%.2f", total));

        var transaction = new Transaction();
        transaction.setDescription("DNC " + donation.getId());
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl("/");
        redirectUrls.setReturnUrl("http://localhost:3002/campaigns/" + donation.getCampaign().getSlug());

        payment.setRedirectUrls(redirectUrls);

        var pay = payment.create(context);

        for (var link : pay.getLinks()) {
            if (link.getRel().equals("approval_url")) {
                return new PaymentInfo(
                        link.getHref(),
                        PaymentInfo.PaymentInfoOpenType.HREF,
                        TransactionProvider.PAYPAL,
                        null
                );
            }
        }

        throw new BadRequestException("Hiện tại phương thức thanh toán qua Paypal không khả dụng");
    }

    @Override
    public boolean isSuccessPayment(Donation donation) {
        return false;
    }
}
