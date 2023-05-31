package vn.edu.funix.charity.controller;


import lombok.AllArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.features.campaign.repository.CampaignRepository;
import vn.edu.funix.charity.common.security.Role;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@AllArgsConstructor
public class NotAuthController {
    private CampaignRepository campaignRepository;

    @GetMapping
    @Secured(Role.NO_USER)
    public List<Campaign> abc() {
        List<Campaign> campaigns = campaignRepository.findAll();
        return campaigns;
    }

    @GetMapping("/test-path")
    public Map<String, Object> chan() {
        Map<String, Object> a = new HashMap<>();

        a.put("active", 1);
        return a;
    }

}
