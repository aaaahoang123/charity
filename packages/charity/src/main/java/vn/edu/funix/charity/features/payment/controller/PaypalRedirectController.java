package vn.edu.funix.charity.features.payment.controller;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.features.donation.service.DonationService;
import vn.edu.funix.charity.features.payment.service.PaymentService;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
@RequestMapping("/public/paypal")
public class PaypalRedirectController {
    private final PaymentService paymentService;
    private final DonationService donationService;
    private final ApplicationConfiguration appConfig;

    public PaypalRedirectController(
            @Qualifier("paypalPaymentService") PaymentService paymentService,
            DonationService donationService,
            ApplicationConfiguration appConfig
    ) {
        this.paymentService = paymentService;
        this.donationService = donationService;
        this.appConfig = appConfig;
    }

    @GetMapping("/{id}/success")
    @Transactional
    public String successPay(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @PathVariable("id") Long id
    ) {
        var donation = donationService.detail(id);
        String transactionId = paymentService.confirmPayment(donation, Map.of(
                "paymentId", paymentId,
                "payerId", payerId
        ));

        if (transactionId != null) {
            donationService.approve(donation, transactionId);

            return "redirect:"
                    + appConfig.getFrontendUrl()
                    + "/campaigns/"
                    + donation.getCampaign().getSlug()
                    + "?success="
                    + URLEncoder.encode("Ủng hộ qua paypal thành công", StandardCharsets.UTF_8);
        }

        return "redirect:"
                + appConfig.getFrontendUrl()
                + "/campaigns/"
                + donation.getCampaign().getSlug()
                + "?error="
                + URLEncoder.encode("Ủng hộ qua paypal thất bại", StandardCharsets.UTF_8);
    }

    @GetMapping("/{id}/cancel")
    public String cancelPay(
            @PathVariable("id") Long id
    ) {
        var donation = donationService.detail(id);
        donationService.reject(donation);

        return "redirect:"
                + appConfig.getFrontendUrl()
                + "/campaigns/"
                + donation.getCampaign().getSlug()
                + "?error="
                + URLEncoder.encode("Bạn đã từ chối thanh toán qua paypal", StandardCharsets.UTF_8);
    }

}
