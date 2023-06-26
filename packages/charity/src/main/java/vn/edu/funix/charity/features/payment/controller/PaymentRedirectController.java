package vn.edu.funix.charity.features.payment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.features.donation.service.DonationService;
import vn.edu.funix.charity.features.payment.service.PaymentManager;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
@RequestMapping("/public/payment")
@RequiredArgsConstructor
public class PaymentRedirectController {
    private final PaymentManager paymentManager;
    private final DonationService donationService;
    private final ApplicationConfiguration appConfig;

    @GetMapping("/redirect/{id}/accept")
    public String processPayment(
            @PathVariable("id") Long id,
            @RequestParam Map<String, Object> body
    ) {
        var donation = donationService.detail(id);
        var transactionCode = paymentManager.confirmPayment(donation, body);
        var provider = donation.getTransactionProvider();
        if (transactionCode == null) {
            return "redirect:"
                    + appConfig.getFrontendUrl()
                    + "/campaigns/"
                    + donation.getCampaign().getSlug()
                    + "?error="
                    + URLEncoder.encode("Ủng hộ qua " + provider.name() + " thất bại", StandardCharsets.UTF_8);
        }

        donationService.approve(donation, transactionCode);

        return "redirect:"
                + appConfig.getFrontendUrl()
                + "/campaigns/"
                + donation.getCampaign().getSlug()
                + "?success="
                + URLEncoder.encode("Ủng hộ qua " + provider.name() + " thành công", StandardCharsets.UTF_8);
    }

    @GetMapping("/redirect/{id}/cancel")
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
                + URLEncoder.encode("Bạn đã từ chối thanh toán", StandardCharsets.UTF_8);
    }

}
