package vn.edu.funix.charity.features.campaign.repository.spec;

import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.Organization;

@AllArgsConstructor
public class CampaignHasOrganizationPhone implements Specification<Campaign> {
    private String phone;
    @Override
    public Predicate toPredicate(Root<Campaign> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Join<Campaign, Organization> join = root.join("organization");
        return criteriaBuilder.like(join.get("phoneNumber"), "%" + phone + "%");
    }
}
