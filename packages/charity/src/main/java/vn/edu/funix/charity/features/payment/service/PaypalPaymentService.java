package vn.edu.funix.charity.features.payment.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;
import vn.edu.funix.charity.features.payment.PaymentConfiguration;
import vn.edu.funix.charity.features.payment.entity.CurrencyConversionData;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service("paypalPaymentService")
public class PaypalPaymentService implements PaymentService {
    private final APIContext context;
    private final PaymentConfiguration configuration;
    private final ApplicationConfiguration appConfig;
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private Double exchangeRate;

    public static final String EXCHANGE_RATE_API_URL = "https://api.currencyapi.com/v3/latest";

    public PaypalPaymentService(
            PaymentConfiguration configuration,
            ApplicationConfiguration appConfig
    ) {
        this.configuration = configuration;
        this.appConfig = appConfig;

        var paypal = configuration.getPaypal();
        context = new APIContext(paypal.getClientId(), paypal.getClientSecret(), paypal.getMode());
    }

    @Override
    public PaymentInfo generatePaymentInfo(Donation donation) throws PayPalRESTException {
        var amount = new Amount();
        amount.setCurrency("USD");
        var total = BigDecimal.valueOf(VNDToUSD(donation.getAmount()))
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
        var baseRedirectUrl = appConfig.getUrl() + getRedirectUri(donation);
        redirectUrls.setReturnUrl(baseRedirectUrl);
        redirectUrls.setCancelUrl(baseRedirectUrl.replace("accept", "cancel"));

        payment.setRedirectUrls(redirectUrls);

        var pay = payment.create(context);

        for (var link : pay.getLinks()) {
            if (link.getRel().equals("approval_url")) {
                return new PaymentInfo(
                        link.getHref(),
                        PaymentInfo.PaymentInfoOpenType.HREF,
                        TransactionProvider.PAYPAL,
                        "Do Paypal không hỗ trợ thanh toán bằng VND, số tiền bạn cần thanh toán được tạm tính là: "
                                + String.format("%.2f", total)
                                + " USD. Bạn có muốn tiếp tục không?",
                        null
                );
            }
        }

        throw new BadRequestException("Hiện tại phương thức thanh toán qua Paypal không khả dụng");
    }


    @Override
    public String confirmPayment(Donation donation, Map<String, Object> meta) {
        String paymentId = (String) meta.get("paymentId");
        String payerId = (String) meta.get("payerId");
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);

        try {
            payment = payment.execute(context, paymentExecute);

            logger.debug("Paypal payment with response: " + payment.toJSON());

            if (payment.getState().equals("approved")) {
                return paymentId;
            }

            logger.warn("Paypal payment has failed, open debug log for more infos");
            return null;
        } catch (PayPalRESTException e) {
            logger.error("Paypal error with message: " + e.getMessage());
            return null;
        }
    }

    protected Double VNDToUSD(long vnd) {
        var rate = getExchangeRate();

        return vnd * rate;
    }

    private Double getExchangeRate() {
        if (exchangeRate == null) {
            refreshExchangeRate();
        }

        return exchangeRate;
    }

    // Refresh exchangeRate at midnight
    @Scheduled(cron = "0 0 * * *")
    public void refreshExchangeRate() {
        var restTemplate = new RestTemplate();

        var url = EXCHANGE_RATE_API_URL
                + "?apikey="
                + configuration.getCurrency().getToken()
                + "&currencies=USD&base_currency=VND";

        var response = restTemplate.getForEntity(url, CurrencyConversionData.class);

        exchangeRate = Objects.requireNonNull(response.getBody()).getData().get("USD").getValue();
    }
}
