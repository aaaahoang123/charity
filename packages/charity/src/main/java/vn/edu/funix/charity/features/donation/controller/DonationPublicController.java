package vn.edu.funix.charity.features.donation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.funix.charity.common.http.Ip;
import vn.edu.funix.charity.common.response.FormatWith;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.common.security.annotation.UserId;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.enumerate.TransactionProvider;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.entity.virtual.TopDonor;
import vn.edu.funix.charity.features.donation.dto.DonationDto;
import vn.edu.funix.charity.features.donation.dto.ListDonationParam;
import vn.edu.funix.charity.features.donation.formatter.DonationFormatter;
import vn.edu.funix.charity.features.donation.service.DonationService;
import vn.edu.funix.charity.features.payment.entity.PaymentInfo;
import vn.edu.funix.charity.features.payment.service.PaymentManager;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/donations")
@AllArgsConstructor
public class DonationPublicController {
    private final DonationService donationService;
    private final PaymentManager paymentManager;

    @PostMapping
    @Transactional
    @FormatWith(DonationFormatter.class)
    public Donation create(
            @UserId String userId,
            @Valid @RequestBody DonationDto dto
    ) {
        var authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        var isAdmin = authorities.stream().anyMatch((au) -> au.getAuthority().equals(Role.ADMIN));
        var donation = donationService.create(userId, dto);

        if (isAdmin) {
            donation.setTransactionProvider(TransactionProvider.TRANSFER);
            donation = donationService.approve(donation, dto.getTransactionCode());
        }

        return donation;
    }

    @GetMapping
    @FormatWith(DonationFormatter.class)
    public Page<Donation> list(
            ListDonationParam params,
            Pageable pageable
    ) {
        var authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        for (var authority : authorities) {
            if (authority.getAuthority().equals(Role.ADMIN)) {
                params.setRole(authority.getAuthority());
            }
        }

        return donationService.getProcessingDonations(params, pageable);
    }

    @GetMapping("/{id}/payment")
    public PaymentInfo paymentInfo(
            @PathVariable("id") Long id,
            @Ip String ip
    ) throws Exception {
        Donation donation = donationService.detail(id);
        donation.setRequesterIp(ip);
        return paymentManager.getPaymentInfo(donation);
    }

    @GetMapping("/statistics")
    public List<DonationStatistic> statistics() {
        return this.donationService.statistics();
    }

    @GetMapping("/top-donors")
    public List<TopDonor> topDonors() {
        return donationService.topDonors();
    }
}
