package vn.edu.funix.charity.features.campaign.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.funix.charity.common.response.FormatWith;
import vn.edu.funix.charity.common.security.annotation.UserId;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;
import vn.edu.funix.charity.features.campaign.formatter.CampaignFormatter;
import vn.edu.funix.charity.features.campaign.service.CampaignService;

import java.util.Objects;

@RestController
@RequestMapping("/api/v1/campaigns")
@FormatWith(CampaignFormatter.class)
@AllArgsConstructor
public class CampaignController {
    private final CampaignService campaignService;

    @PostMapping
    @Transactional
    public Campaign create(
            @UserId String userId,
            @Valid @RequestBody CreateCampaignRequestDto dto
    ) {
        return campaignService.create(userId, dto);
    }

    @GetMapping
    public Page<Campaign> list(
            ListCampaignParams params,
            Pageable pageable
    ) {
        var authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        params.setIgnoreStatus(CampaignStatus.INITIAL);
        for (var authority: authorities) {
            if (Objects.equals(authority.getAuthority(), "ROLE_ADMIN")) {
                params.setIgnoreStatus(null);
            }
        }

        return campaignService.list(params, pageable);
    }

    @GetMapping("/{slug}")
    public Campaign detail(@PathVariable("slug") String slug) {
        return campaignService.detail(slug);
    }

    @DeleteMapping("/{slug}")
    public Campaign delete(@PathVariable("slug") String slug) {
        return campaignService.delete(slug);
    }

    @PutMapping("/{slug}")
    public Campaign update(
            @PathVariable("slug") String slug,
            @Valid @RequestBody CreateCampaignRequestDto dto,
            @UserId String userId
    ) {
        return campaignService.update(slug, userId, dto);
    }
}
