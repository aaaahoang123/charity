package vn.edu.funix.charity.features.campaign.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.common.specification.FetchRelation;
import vn.edu.funix.charity.common.specification.WhereHas;
import vn.edu.funix.charity.common.util.DateTimeUtils;
import vn.edu.funix.charity.common.util.StringToSlug;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Organization;
import vn.edu.funix.charity.entity.Subscriber;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.entity.enumerate.DonationStatus;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;
import vn.edu.funix.charity.features.campaign.event.CampaignUpdated;
import vn.edu.funix.charity.features.campaign.repository.CampaignRepository;
import vn.edu.funix.charity.features.campaign.repository.OrganizationRepository;
import vn.edu.funix.charity.features.campaign.repository.SubscriberRepository;
import vn.edu.funix.charity.features.campaign.repository.spec.*;
import vn.edu.funix.charity.features.donation.repository.DonationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;


@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {
    private final Logger logger = LoggerFactory.getLogger(CampaignServiceImpl.class);

    private final CampaignRepository campaignRepository;
    private final OrganizationRepository organizationRepository;
    private final SubscriberRepository subscriberRepository;
    private final DonationRepository donationRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public Campaign create(String userId, CreateCampaignRequestDto dto) {
        Campaign campaign = new Campaign();
        fillCampaignData(campaign, dto);
        campaign.setCreatedByUserId(userId);
        campaign.setLastUpdatedByUserId(userId);
        campaign.setTotalReceivedAmount(0L);
        campaign.setTotalDonations(0);
        campaign.setStatus(CampaignStatus.INITIAL);

        Organization organization = handleOrganization(dto);

        campaign.setOrganization(organization);

        String slug = StringToSlug.compile(dto.getTitle());

        Optional<Campaign> existedCampaignBySlug = campaignRepository.findBySlug(slug);
        if (existedCampaignBySlug.isPresent()) {
            LocalDateTime now = LocalDateTime.now();
            slug += "-" + DateTimeUtils.formatDateTime(now, "yyyy-MM-dd-HH-mm-ss");
        }

        campaign.setSlug(slug);

        return campaignRepository.save(campaign);
    }

    @Override
    public Page<Campaign> list(String userId, ListCampaignParams params, Pageable pageable) {
        Specification<Campaign> spec = Specification.where(new FetchRelation<>("organization"));

        if (params.getIgnoreStatus() != null) {
            spec = spec.and(new CampaignNotHasStatus(params.getIgnoreStatus()));
        }

        if (params.getId() != null) {
            spec = spec.and(new CampaignHasId(params.getId()));
        }

        if (params.getTerm() != null) {
            spec = spec.and(new CampaignHasTerm(params.getTerm()));
        }

        if (params.getPhone() != null) {
            spec = spec.and(new CampaignHasOrganizationPhone(params.getPhone()));
        }

        if (params.getStatus() != null) {
            spec = spec.and(new CampaignHasStatus(params.getStatus()));
        }

        if (params.getIsSubscribed() && userId != null) {
            spec = spec.and(new WhereHas<>("subscribers", List.of(new SubscriberHasUserId(userId))));
        }

        Pageable correctPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("id").descending()
        );

        return campaignRepository.findAll(spec, correctPageable);
    }

    @Override
    public Campaign detail(String slug) {
        return campaignRepository.findBySlugAndFetchOrganization(slug)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đợt quyên góp"));
    }

    @Override
    public Campaign delete(String slug) throws BadRequestException {
        Campaign campaign = detail(slug);
        if (campaign.getStatus() != CampaignStatus.INITIAL) {
            throw new BadRequestException("Đợt quyên góp không trong trạng thái mới tạo, không thể xóa.");
        }
        campaignRepository.delete(campaign);
        return campaign;
    }

    @Override
    public Campaign update(String slug, String userId, CreateCampaignRequestDto dto) throws BadRequestException {
        Campaign campaign = detail(slug);
        if (campaign.getStatus() == CampaignStatus.CLOSED) {
            throw new BadRequestException("Đợt quyên góp đã đóng, không thể cập nhật thông tin");
        }

        var oldStatus = campaign.getStatus();

        fillCampaignData(campaign, dto);

        if (!Objects.equals(campaign.getOrganizationId(), dto.getOrganizationId())) {
            Organization organization = handleOrganization(dto);
            campaign.setOrganization(organization);
        }

        campaign.setLastUpdatedByUserId(userId);

        if (dto.getStatus() != null) {
            campaign.setStatus(dto.getStatus());
        }

        var result = campaignRepository.save(campaign);

        var event = new CampaignUpdated(this, result, dto.getStatus() != null && oldStatus != dto.getStatus() ? dto.getStatus() : null);

        eventPublisher.publishEvent(event);

        return result;
    }

    private void fillCampaignData(Campaign campaign, CreateCampaignRequestDto dto) {
        campaign.setTitle(dto.getTitle());
        campaign.setDescription(dto.getDescription());
        campaign.setContent(dto.getContent());
        campaign.setTargetAmount(dto.getTargetAmount());
        campaign.setDeadline(dto.getDeadline());
        campaign.setImages(dto.getImages());
    }

    private Organization handleOrganization(CreateCampaignRequestDto dto) {
        if (dto.getOrganizationId() == null) {
            Organization organization = new Organization();
            organization.setName(dto.getOrganizationName());
            organization.setEmail(dto.getOrganizationEmail());
            organization.setPhoneNumber(dto.getOrganizationPhone());
            organization.setAvatar(dto.getOrganizationAvatar());
            organization = organizationRepository.save(organization);
            logger.debug("Organization id is empty! Create new organization " + organization.getId() + " with the profile");
            return organization;
        }

        Organization organization = organizationRepository
                .findById(dto.getOrganizationId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tổ chức"));
        logger.debug("Found organization with id " + organization.getId() + " and title: " + organization.getName());

        return organization;
    }

    @Override
    public Campaign triggerSubscribe(String userId, String slug) {
        var campaign = detail(slug);
        var subscribedOptional = subscriberRepository.findSubscriberByUserIdAndCampaignId(userId, campaign.getId());
        if (subscribedOptional.isPresent()) {
            subscriberRepository.delete(subscribedOptional.get());
        } else {
            var subscriber = new Subscriber();
            subscriber.setCampaign(campaign);
            subscriber.setUserId(userId);
            subscriber.setWillSendMail(false);
            subscriberRepository.save(subscriber);
        }
        return campaign;
    }

    @Override
    public Campaign triggerWillSendMail(String userId, String userEmail, String slug) {
        var campaign = detail(slug);
        var subscribed = subscriberRepository
                .findSubscriberByUserIdAndCampaignId(userId, campaign.getId())
                .orElseThrow(() -> new BadRequestException("You must subscribe the campaign first"));

        subscribed.setWillSendMail(!subscribed.getWillSendMail());
        subscribed.setUserEmail(userEmail);
        subscriberRepository.save(subscribed);
        return campaign;
    }

    @Override
    public List<Subscriber> findSubscriberOfUserWithCampaigns(String userId, Collection<Integer> campaignIds) {
        return subscriberRepository.findAllByUserIdAndCampaignIdIn(userId, campaignIds);
    }

    @Override
    public List<String> findAllSubscribedMailsOfCampaign(Campaign campaign) {
        return subscriberRepository.findAllEmailByCampaignId(campaign.getId());
    }

    @Override
    public List<DonationStatistic> getDonationStatisticOfCampaign(String slug) {
        var campaign = detail(slug);

        return donationRepository.statisticDonationByCampaignId(campaign.getId(), DonationStatus.CONFIRMED);
    }

    @Override
    public Map<String, Long> getCampaignStatistics() {
        var runningCampaigns = campaignRepository.countRunningCampaign();
        var totalCampaigns = campaignRepository.countTotalCampaign();

        return Map.of(
                "running", runningCampaigns,
                "total", totalCampaigns
        );
    }

    @Scheduled(cron = "0 1 * * *")
    public void updateStatusDaily() {
        logger.info("Scanning and update status for expired campaign");
        var campaigns = campaignRepository.findByStatusIsInAndDeadlineIsLessThan(List.of(CampaignStatus.OPENING, CampaignStatus.INITIAL), LocalDate.now());

        for (var campaign : campaigns) {
            logger.debug("Update campaign: " + campaign.getId() + " to complete because it is expired of running times");
            campaign.setStatus(CampaignStatus.COMPLETED);
            campaignRepository.save(campaign);
        }
    }
}
