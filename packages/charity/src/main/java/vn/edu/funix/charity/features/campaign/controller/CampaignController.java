package vn.edu.funix.charity.features.campaign.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.funix.charity.common.response.FormatWith;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.common.security.annotation.UserId;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.features.campaign.dto.CreateCampaignRequestDto;
import vn.edu.funix.charity.features.campaign.formatter.CampaignFormatter;
import vn.edu.funix.charity.features.campaign.service.CampaignService;

@RestController
@RequestMapping("/api/v1/campaigns")
@FormatWith(CampaignFormatter.class)
@AllArgsConstructor
public class CampaignController {
    private final CampaignService campaignService;

    @PostMapping
    @Transactional
    @PreAuthorize("hasRole('" + Role.ADMIN + "')")
    public Campaign create(
            @UserId String userId,
            @Valid @RequestBody CreateCampaignRequestDto dto
    ) {
        return campaignService.create(userId, dto);
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
