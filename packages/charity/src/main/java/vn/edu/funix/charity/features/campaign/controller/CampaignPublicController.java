package vn.edu.funix.charity.features.campaign.controller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.common.response.FormatWith;
import vn.edu.funix.charity.common.security.Role;
import vn.edu.funix.charity.common.security.annotation.UserId;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;
import vn.edu.funix.charity.entity.virtual.DonationStatistic;
import vn.edu.funix.charity.features.campaign.dto.CampaignWithSubscribedDto;
import vn.edu.funix.charity.features.campaign.dto.ListCampaignParams;
import vn.edu.funix.charity.features.campaign.formatter.CampaignFormatter;
import vn.edu.funix.charity.features.campaign.service.CampaignService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/campaigns")
@FormatWith(CampaignFormatter.class)
@AllArgsConstructor
public class CampaignPublicController {
    private final CampaignService campaignService;

    @GetMapping
    public Page<Campaign> list(
            ListCampaignParams params,
            Pageable pageable,
            @UserId String userId
    ) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var authorities = authentication.getAuthorities();
        params.setIgnoreStatus(CampaignStatus.INITIAL);
        for (var authority : authorities) {
            if (authority.getAuthority().equals(Role.ADMIN)) {
                params.setIgnoreStatus(null);
                params.setIsSubscribed(false);
                break;
            }
        }
        return campaignService.list(userId, params, pageable);
    }

    @GetMapping("/{slug}")
    public Campaign detail(
            @PathVariable("slug") String slug,
            @UserId String userId
    ) {
        var campaign = campaignService.detail(slug);

        if (userId != null) {
            var subscribed = campaignService.findSubscriberOfUserWithCampaigns(userId, List.of(campaign.getId()));
            if (!subscribed.isEmpty()) {
                var subScribedData = subscribed.get(0);
                var dto = new CampaignWithSubscribedDto(campaign);
                dto.setSubscribed(true);
                dto.setWillSendMail(subScribedData.getWillSendMail());
                return dto;
            }
        }

        return campaign;
    }

    @GetMapping("/{slug}/donation-statistics")
    public List<DonationStatistic> statistic(
            @PathVariable("slug") String slug
    ) {
        return campaignService.getDonationStatisticOfCampaign(slug);
    }
}
