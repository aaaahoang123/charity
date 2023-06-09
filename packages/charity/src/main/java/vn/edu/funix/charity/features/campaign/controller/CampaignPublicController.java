package vn.edu.funix.charity.features.campaign.controller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.common.response.FormatWith;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;
import vn.edu.funix.charity.features.campaign.formatter.CampaignFormatter;
import vn.edu.funix.charity.features.campaign.service.CampaignService;

@RestController
@RequestMapping("/api/v1/public/campaigns")
@FormatWith(CampaignFormatter.class)
@AllArgsConstructor
public class CampaignPublicController {
    private final CampaignService campaignService;

    @GetMapping
    public Page<Campaign> list(
            ListCampaignParams params,
            Pageable pageable
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(Role.ADMIN))) {
            params.setIgnoreStatus(CampaignStatus.INITIAL);
        } else {
            params.setIgnoreStatus(null);
        }
        return campaignService.list(params, pageable);
    }

    @GetMapping("/{slug}")
    public Campaign detail(@PathVariable("slug") String slug) {
        return campaignService.detail(slug);
    }
}