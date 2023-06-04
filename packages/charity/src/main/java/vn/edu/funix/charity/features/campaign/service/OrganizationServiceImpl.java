package vn.edu.funix.charity.features.campaign.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.edu.funix.charity.entity.Organization;
import vn.edu.funix.charity.features.campaign.repository.OrganizationRepository;
import vn.edu.funix.charity.features.campaign.repository.spec.OrganizationHasTerm;

@Service
@AllArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {
    private final OrganizationRepository organizationRepository;
    @Override
    public Page<Organization> search(String term, Pageable pageable) {
        Specification<Organization> specification = Specification.where(null);

        if (term != null) {
            specification.and(new OrganizationHasTerm(term));
        }
        return organizationRepository.findAll(specification, pageable);
    }
}
