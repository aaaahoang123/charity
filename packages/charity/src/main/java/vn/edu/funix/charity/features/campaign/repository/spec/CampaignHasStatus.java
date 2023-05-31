package vn.edu.funix.charity.features.campaign.repository.spec;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import vn.edu.funix.charity.entity.Campaign;
import vn.edu.funix.charity.entity.enumerate.CampaignStatus;

@AllArgsConstructor
public class CampaignHasStatus implements Specification<Campaign> {
    private CampaignStatus status;
    @Override
    public Predicate toPredicate(Root<Campaign> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        return cb.equal(root.get("status"), status);
    }
}
