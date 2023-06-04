package vn.edu.funix.charity.features.campaign.service;

import vn.edu.funix.charity.entity.Organization;

import java.util.List;

public interface OrganizationService {
    List<Organization> search(String term);
}
