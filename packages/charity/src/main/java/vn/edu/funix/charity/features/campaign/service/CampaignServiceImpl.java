package vn.edu.funix.charity.features.campaign.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.common.exception.BadRequestException;
import vn.edu.funix.charity.common.specification.FetchRelation;
import vn.edu.funix.charity.common.util.DateTimeUtils;
import vn.edu.funix.charity.common.util.StringToSlug;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Organization;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;
import vn.edu.funix.charity.features.campaign.repository.CampaignRepository;
import vn.edu.funix.charity.features.campaign.repository.OrganizationRepository;
import vn.edu.funix.charity.features.campaign.repository.spec.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {
    private final Logger logger = LoggerFactory.getLogger(CampaignServiceImpl.class);

    private final CampaignRepository campaignRepository;
    private final OrganizationRepository organizationRepository;

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
    public Page<Campaign> list(ListCampaignParams params, Pageable pageable) {
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

        if (params.isSubscribed()) {
            // TODO: Return only subscribed
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

        fillCampaignData(campaign, dto);

        if (!Objects.equals(campaign.getOrganizationId(), dto.getOrganizationId())) {
            Organization organization = handleOrganization(dto);
            campaign.setOrganization(organization);
        }

        campaign.setLastUpdatedByUserId(userId);

        if (dto.getStatus() != null) {
            campaign.setStatus(dto.getStatus());
        }

        return campaignRepository.save(campaign);
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
}
