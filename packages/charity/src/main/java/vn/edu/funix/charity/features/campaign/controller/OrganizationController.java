package vn.edu.funix.charity.features.campaign.controller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.funix.charity.common.response.FormatWith;
import vn.edu.funix.charity.entity.Organization;
import vn.edu.funix.charity.features.campaign.formatter.OrganizationFormatter;
import vn.edu.funix.charity.features.campaign.service.OrganizationService;

@RestController
@RequestMapping("/api/v1/organizations")
@AllArgsConstructor
@FormatWith(OrganizationFormatter.class)
public class OrganizationController {
    private final OrganizationService organizationService;

    @GetMapping
    public Page<Organization> search(
            @RequestParam(value = "term", required = false) String term,
            Pageable pageable
    ) {
        return organizationService.search(term, pageable);
    }
}
