package vn.edu.funix.charity.features.donation.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.Donor;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.entity.virtual.TopDonor;
import vn.edu.funix.charity.features.donation.dto.DonationDto;
import vn.edu.funix.charity.features.donation.dto.ListDonationParam;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface DonationService {
    Donation create(@Nullable String userId, DonationDto dto);
    Donation detail(Long id);
    Collection<Donor> getListDonorOfUser(String userId);
    Donation approve(Donation donation, String transactionId);

    Donation reject(Donation donation);

    Page<Donation> getProcessingDonations(ListDonationParam params, Pageable pageable);

    List<DonationStatistic> statistics();

    List<TopDonor> topDonors();
}
