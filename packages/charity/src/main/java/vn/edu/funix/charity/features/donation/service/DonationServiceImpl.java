package vn.edu.funix.charity.features.donation.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.Donor;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.features.campaign.repository.CampaignRepository;
import vn.edu.funix.charity.features.donation.dto.DonationDto;
import vn.edu.funix.charity.features.donation.repository.DonationRepository;
import vn.edu.funix.charity.features.donation.repository.DonorRepository;

import java.util.Collection;

@Service
@AllArgsConstructor
public class DonationServiceImpl implements DonationService {
    private DonationRepository donationRepository;
    private DonorRepository donorRepository;
    private CampaignRepository campaignRepository;

    @Override
    public Donation create(@Nullable String userId, DonationDto dto) {
        var campaign = resolveCampaign(dto.getCampaignSlug());
        var donor = resolveDonor(userId, dto);

        var donation = new Donation();
        fillDonationData(donation, dto);

        donation.setCampaign(campaign);
        donation.setDonor(donor);
        donation.setCreatedByUserId(userId);
        donation.setLastUpdatedByUserId(userId);
//        donation.setTransactionCode("TX" + System.currentTimeMillis());
        donation.setStatus(DonationStatus.INITIAL);

        return donationRepository.save(donation);
    }

    @Override
    public Donation detail(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin thanh toán"));
    }

    protected Campaign resolveCampaign(String slug) {
        var campaign = campaignRepository
                .findBySlug(slug)
                .orElseThrow(() -> new BadRequestException("Đợt quyên góp không tồn tại"));

        if (campaign.getStatus() != CampaignStatus.OPENING) {
            throw new BadRequestException("Hiện đợt quyên góp đang không mở");
        }

        return campaign;
    }

    @Nullable
    protected Donor resolveDonor(@Nullable String userId, DonationDto dto) {
        if (dto.getDonorId() != null) {
            return donorRepository.findById(dto.getDonorId())
                    .orElseThrow(() -> new BadRequestException("Nhà hảo tâm đã chọn không hợp lệ!"));
        }

        if (
                dto.getDonorName() != null
                || dto.getDonorEmail() != null
                || dto.getDonorPhoneNumber() != null
        ) {
            var donor = new Donor();
            donor.setName(dto.getDonorName());
            donor.setEmail(dto.getDonorEmail());
            donor.setPhoneNumber(dto.getDonorPhoneNumber());
            donor.setCreatedByUserId(userId);
            return donorRepository.save(donor);
        }

        return null;
    }

    protected void fillDonationData(Donation donation, DonationDto dto) {
        donation.setAmount(dto.getAmount());
        donation.setMessage(dto.getMessage());
        donation.setTransactionProvider(dto.getTransactionProvider());
    }

    @Override
    public Collection<Donor> getListDonorOfUser(String userId) {
        return donorRepository.findAllByCreatedByUserId(userId);
    }
}
