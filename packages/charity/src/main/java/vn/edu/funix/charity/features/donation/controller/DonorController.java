package vn.edu.funix.charity.features.donation.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.common.security.annotation.UserId;
import vn.edu.funix.charity.entity.Donor;
import vn.edu.funix.charity.features.donation.service.DonationService;

import java.util.Collection;

@RestController
@RequestMapping("/api/v1/donors")
@AllArgsConstructor
public class DonorController {
    private final DonationService donationService;

    @GetMapping
    public Collection<Donor> list(@UserId String userId) {
        return donationService.getListDonorOfUser(userId);
    }
}
