package vn.edu.funix.charity.features.campaign.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.funix.charity.entity.Organization;

public interface OrganizationService {
    Page<Organization> search(String term, Pageable pageable);
}
