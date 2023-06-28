package vn.edu.funix.charity.features.donation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.funix.charity.common.http.Ip;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.donation.dto.ApproveDonationDto;
import vn.edu.funix.charity.features.donation.service.DonationService;

@RestController
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
public class DonationController {
    private final DonationService donationService;

    @PostMapping("/{id}/approve")
    @Transactional
    @PreAuthorize("hasRole('"+ Role.ADMIN +"')")
    public Donation approve(
            @RequestBody @Valid ApproveDonationDto dto,
            @PathVariable("id") Long id,
            @Ip String ip
            ) {
        var donation = donationService.detail(id);
        donation.setRequesterIp(ip);
        return donationService.approve(donation, dto.getTransactionCode());
    }

    @GetMapping("/{id}/reject")
    @Transactional
    @PreAuthorize("hasRole('"+ Role.ADMIN +"')")
    public Donation reject(@PathVariable("id") Long id) {
        var donation = donationService.detail(id);
        return donationService.reject(donation);
    }
}
