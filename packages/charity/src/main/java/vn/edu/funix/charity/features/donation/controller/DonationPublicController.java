package vn.edu.funix.charity.features.donation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.common.security.annotation.UserId;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.donation.dto.DonationDto;
import vn.edu.funix.charity.features.donation.service.DonationService;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;
import vn.edu.funix.charity.features.payment.service.PaymentManager;

@RestController
@RequestMapping("/api/v1/public/donations")
@AllArgsConstructor
public class DonationPublicController {
    private final DonationService donationService;
    private final PaymentManager paymentManager;

    @PostMapping
    @PreAuthorize("hasRole('" + Role.NO_USER + "') or hasRole('" + Role.USER + "')")
    public Donation create(
            @UserId String userId,
            @Valid @RequestBody DonationDto dto
    ) {
        return donationService.create(userId, dto);
    }

    @GetMapping("{id}/payment")
    public PaymentInfo paymentInfo(@PathVariable("id") Long id) throws Exception {
        Donation donation = donationService.detail(id);
        return paymentManager.getPaymentInfo(donation);
    }
}
