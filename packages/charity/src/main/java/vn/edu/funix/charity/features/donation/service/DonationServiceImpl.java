package vn.edu.funix.charity.features.donation.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Donation;
import vn.edu.funix.charity.entity.Donor;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.entity.virtual.TopDonor;
import vn.edu.funix.charity.features.campaign.event.CampaignUpdated;
import vn.edu.funix.charity.features.campaign.repository.CampaignRepository;
import vn.edu.funix.charity.features.donation.dto.DonationDto;
import vn.edu.funix.charity.features.donation.dto.ListDonationParam;
import vn.edu.funix.charity.features.donation.repository.DonationRepository;
import vn.edu.funix.charity.features.donation.repository.DonorRepository;
import vn.edu.funix.charity.features.donation.repository.spec.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Service
@AllArgsConstructor
public class DonationServiceImpl implements DonationService {
    private DonationRepository donationRepository;
    private DonorRepository donorRepository;
    private CampaignRepository campaignRepository;
    private final ApplicationEventPublisher eventPublisher;

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

    @Override
    public Donation approve(Donation donation, String transactionId) {
        donation.setStatus(DonationStatus.CONFIRMED);
        donation.setTransactionCode(transactionId);
        donation.setConfirmedAt(LocalDateTime.now());
        donationRepository.save(donation);

        var campaign = donation.getCampaign();

        var totalReceivedAmount = campaign.getTotalReceivedAmount() + donation.getAmount();
        campaign.setTotalDonations(campaign.getTotalDonations() + 1);
        campaign.setTotalReceivedAmount(totalReceivedAmount);

        if (totalReceivedAmount >= campaign.getTargetAmount()) {
            campaign.setStatus(CampaignStatus.COMPLETED);
            eventPublisher.publishEvent(new CampaignUpdated(this, campaign, CampaignStatus.COMPLETED));
        }

        campaignRepository.save(campaign);

        return donation;
    }

    @Override
    public Donation reject(Donation donation) {
        donation.setStatus(DonationStatus.REJECTED);
        return donationRepository.save(donation);
    }

    @Override
    public Page<Donation> getProcessingDonations(ListDonationParam params, Pageable pageable) {
        var spec = Specification.where(new DonationFetchRelations());

        var isAdmin = Role.ADMIN.equals(params.getRole());

        if (!isAdmin) {
            spec = spec.and(new DonationHasStatus(DonationStatus.CONFIRMED));
        } else if (params.getStatus() != null){
            spec = spec.and(new DonationHasStatus(params.getStatus()));
        }

        if (params.getCampaignId() != null) {
            spec = spec.and(new DonationHasCampaignId(params.getCampaignId()));
        }

        if (params.getProvider() != null) {
            spec = spec.and(new DonationHasProvider(params.getProvider()));
        }

        if (params.getTerm() != null) {
            spec = spec.and(new DonationHasTerm(params.getTerm()));
        }

        var realPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("id").descending()
        );

        return donationRepository.findAll(spec, realPageable);
    }

    @Override
    public List<DonationStatistic> statistics() {
        return donationRepository.statisticDonationAll(DonationStatus.CONFIRMED);
    }

    @Override
    public List<TopDonor> topDonors() {
        return donationRepository.findTopDonors();
    }
}
