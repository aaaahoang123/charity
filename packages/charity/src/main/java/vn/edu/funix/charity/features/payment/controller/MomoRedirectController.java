package vn.edu.funix.charity.features.payment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.funix.charity.config.ApplicationConfiguration;
import vn.edu.funix.charity.features.donation.service.DonationService;
import vn.edu.funix.charity.features.payment.service.MomoPaymentService;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
@RequestMapping("/public/momo")
@RequiredArgsConstructor
public class MomoRedirectController {
    private final DonationService donationService;
    private final ApplicationConfiguration appConfig;
    private final MomoPaymentService momoPaymentService;

    @GetMapping("{id}")
    @Transactional
    public String successPay(
            @PathVariable("id") Long id,
            @RequestParam Map<String, Object> body
            ) {
        var donation = donationService.detail(id);

        var transactionCode = momoPaymentService.confirmPayment(donation, body);

        if (transactionCode == null) {
            return "redirect:"
                    + appConfig.getFrontendUrl()
                    + "/campaigns/"
                    + donation.getCampaign().getSlug()
                    + "?error="
                    + URLEncoder.encode("Ủng hộ qua momo thất bại", StandardCharsets.UTF_8);
        }

        donationService.approve(donation, transactionCode);

        return "redirect:"
                + appConfig.getFrontendUrl()
                + "/campaigns/"
                + donation.getCampaign().getSlug()
                + "?success="
                + URLEncoder.encode("Ủng hộ qua momo thành công", StandardCharsets.UTF_8);
    }
}
