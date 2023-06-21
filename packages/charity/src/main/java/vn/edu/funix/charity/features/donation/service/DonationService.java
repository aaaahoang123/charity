package vn.edu.funix.charity.features.donation.service;

import org.springframework.lang.Nullable;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.features.donation.dto.DonationDto;

public interface DonationService {
    Donation create(@Nullable String userId, DonationDto dto);
    Donation detail(Long id);
}
